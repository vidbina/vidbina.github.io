namespace :site do
  desc 'generate new post as `rake site:new "Title" "category"`'
  task :new do
    args = ARGV.map do |arg|
      task arg.to_sym do; end
      arg.to_s
    end

    time = Time.now
    _, title, category = args

    if title and category
      puts "\tTitle: #{title}\n\tCategory: #{category}\n\tTime: #{time}"

      front_matter = File.open('_includes/front.template.jekyll', 'r') do |f|
        template = f.read
        template = template.gsub '{{DATE}}', time.to_s
        (template = template.gsub '{{TITLE}}', title) if title
        (template = template.gsub '{{CATEGORY}}', category) if category
        template
      end

      filename = "#{time.strftime '%Y-%m-%d'}-#{title.downcase}".gsub ' ', '-'
      file = "_drafts/#{filename}.markdown"
      File.open(file, "w") do |f|
        f.puts front_matter
      end

      exec "git add #{file}"
    else
      puts "Usage: rake site:new ${TITLE} ${CATEGORY}"
    end
  end
end
