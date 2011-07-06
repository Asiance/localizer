require 'datamapper'

class Message
    include DataMapper::Resource
    property :id, Serial
    property :body, String
    property :created_at, DateTime

    belongs_to :category
    has n, :translations
end

