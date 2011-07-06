require 'datamapper'

class Category
    include DataMapper::Resource
    property :id, Serial
    property :name, String
    property :icon_path, String
    property :created_at, DateTime

    has n, :messages
end
