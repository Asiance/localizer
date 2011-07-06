require 'datamapper'

class Translation
    include DataMapper::Resource

    property :body, String
    property :created_at, DateTime
    property :lang, String, :key => true
    property :size, Integer
    property :family, String

    belongs_to :message, 'Message', :key => true
end


