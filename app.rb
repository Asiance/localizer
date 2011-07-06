#!/usr/bin/env ruby
# encoding: utf-8

require "bundler/setup"

require 'sinatra'
require 'RMagick'
require 'datamapper'
require 'koala'
require 'open-uri'

DataMapper::setup(:default, "sqlite3://#{Dir.pwd}/localizer.db")
require './models/category.rb'
require './models/message.rb'
require './models/translation.rb'

# automatically create the post table
Message.auto_migrate! unless Message.storage_exists?
Category.auto_migrate! unless Category.storage_exists?
Translation.auto_migrate! unless Translation.storage_exists?

include Magick

Fontz = {
  'ko' => { :family => 'Malgun Gothic', :size => '35' },
  # 'ko' => { :family => 'SD_Puzzle Bk' },
  'cn' => { :family => 'Kai', :size => '60' },
  'jp' => { :family => 'YAKITORI', :size => '40' },
  'en' => { :family => 'Malgun Gothic', :size => '40' },
  'fr' => { :family => 'Malgun Gothic', :size => '40' },
}

Size = 301

class Localizer < Sinatra::Application
  set :static, true
  enable :sessions

  get '/' do
    @messages = Message.all
    session[:image_path] = ''

    erb :index
  end

  post '/' do
    @messages = Message.all
    session[:image_path] = ''

    erb :index
  end

  def legit? (prm)
    keys = ['c1', 'c2', 'caption', 'lang']
    keys.all? { |k| prm.has_key? k }
  end

  get '/caption' do
    # normalizing params
    unless legit? params
      return status 400
    end

    if params[:lang].empty? or params[:lang] == 'jp' then params['lang'] = 'ko' end
    if params[:caption].empty? then params[:caption] = '2' end
    if params[:c1].empty? then params[:c1] = '#ffffff' end
    if params[:c2].empty? then params[:c2] = '#000000' end

    begin
      caption = Translation.first(
        :message => { :id => params[:caption] },
        :lang => params[:lang]
      ).body 
    rescue
      return status 400
    end

    # caption path
    name = "#{params[:lang]}-#{params[:caption]}-#{params[:c1]}-#{params[:c2]}.png"
    path = File.expand_path('..', __FILE__) + "/public/captions/" + name
    session[:message_path] = path

    # serving image if already cached
    if (File.exists? path)
      image = Image.read(path)[0]
      content_type 'image/png'
      image.format = 'png'
      return image.to_blob
    end

    # generating
    draw = draw_text(params[:lang], caption, params[:c1], params[:c2])

    image = Image.new(600, 600) { 
      self.background_color = 'black' 
    }
    image = image.transparent('black', TransparentOpacity)

    draw.draw image
    image.trim!

    # caching
    image.write(path)

    # output
    content_type 'image/png'
    image.format = 'png'
    image.to_blob
  end

  post '/upload' do
    unless params[:image] && 
      (tmpfile = params[:image][:tempfile]) && 
      (name = params[:image][:filename])

      return status 400
    end

    if not session[:session_id] then return 'fail.' end
    
    filename = session[:session_id][0..15] + Time.now.to_i.to_s + '.png'
    path = File.expand_path('..', __FILE__) + "/public/uploads/" + filename
    session[:image_path] = path
    session[:image_name] = filename

    newf = File.open(path, 'w+')
    until tmpfile.eof?
      buf = tmpfile.read(65536)
      newf.write(buf)
    end

    # resize if too big
    img = Image.read(path)[0]
    if img.columns > 420 or img.rows > 360
      img.resize_to_fit!(420, 360)
      # TODO preserve big image!?
      img.write(path)
    end

    url('/uploads/' + filename)
  end

  post '/fbupload' do
    unless params[:access_token] && params[:pid]
      return status 400
    end

    # FIXME duplicate code with POST /upload above
    if not session[:session_id] then return 'fail.' end

    filename = session[:session_id][0..15] + Time.now.to_i.to_s + '.png'
    path = File.expand_path('..', __FILE__) + "/public/uploads/" + filename
    session[:image_path] = path
    session[:image_name] = filename

    # contacting FB
    graph = Koala::Facebook::GraphAPI.new(params[:access_token])

    imgs = graph.get_object(params[:pid])['images']
    # very large pics have an extra size
    pic = imgs.size > 4 ? imgs[1] : imgs[0]

    # pic contains width, height, source
    # open-uri loaded to open network streams
    img = Image.read(pic['source'])[0]
    if img.columns > 420 or img.rows > 360
      img.resize_to_fit!(420, 360)
      # TODO preserve big image!?
    end

    img.write(path)

    url('/uploads/' + filename)
  end

  get '/cropped' do
    x = params[:x].to_i
    y = params[:y].to_i
    width = params[:w].to_i
    height = params[:h].to_i

    path = session[:image_path]

    img = Image.read(path)[0]
    img.crop!(x, y, width, height)
    img.resize_to_fill!(Size, Size)

    img.write(path)

    # output
    content_type 'image/png'
    img.format = 'png'
    img.to_blob
  end

  post '/share' do
    # normalizing params
    if params[:x].empty? then params[:x] = '0' end 
    if params[:y].empty? then params[:y] = '0' end 

    path = session[:image_path]

    # merging 2 images, background and caption
    image = Image.read(path)[0]
    message = Image.read(session[:message_path])[0]

    # polaroid effect
    # have to change x and y to adapt to new border
    border = 13
    bottom = 70
    x = params[:x].to_i + border
    y = params[:y].to_i + border

    # white border
    whitebg = Image.new(Size + border*2, Size + border + bottom) {
      self.background_color = '#f0f0ff'
    }

    image = whitebg.composite(image, border, border, OverCompositeOp)

    # curling
    amplitude = image.columns * 0.01
    wavelength = image.rows  * 2

    image.rotate!(90)
    image = image.wave(amplitude, wavelength)
    image.rotate!(-90)

    # shadow
    shadow = image.flop
    shadow = shadow.colorize(1, 1, 1, "gray75")
    shadow.background_color = "black"
    shadow.border!(10, 10, "white")
    shadow = shadow.blur_image(0, 3)

    image = shadow.composite(image, -amplitude/2, 5, Magick::OverCompositeOp)

    # composing
    image.composite!(message,
                     NorthWestGravity,
                     x,
                     y,
                     OverCompositeOp)

    image.write(path)

    # contacting FB
    graph = Koala::Facebook::GraphAPI.new(params[:access_token])
    graph.put_picture(path)

    # TODO delete photo from disk

    url('/uploads/' + session[:image_name])
  end

  # Draws text with outline: caption at position x,y
  # c1 is filling color
  # c2 is outline color
  def draw_text (lang, caption, c1, c2, x = 0, y = 0)
    if c1.empty? then c1 = "#ffffff" end
    if c2.empty? then c2 = "#000000" end

    draw = Magick::Draw.new

    draw.encoding('utf8')
    draw.font_family(Fontz[lang][:family])
    draw.pointsize(Fontz[lang][:size])
    draw.font_weight(900)
    draw.text_antialias(true)
    draw.font_stretch(3)

    draw.stroke_width(1)
    draw.stroke_antialias(true)
    draw.stroke_linecap('round')
    draw.stroke_linejoin('round')

    draw.fill(c1)
    draw.stroke(c2)

    draw.gravity(NorthWestGravity)
    draw.text(x, y, caption)

    draw
  end
end
