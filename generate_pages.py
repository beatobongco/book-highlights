import os, codecs
from jinja2 import Environment, FileSystemLoader

print os.getcwd()
env = Environment(
  loader=FileSystemLoader(os.getcwd() + '/templates'),
  autoescape=True
)

template = env.get_template('book.html')

# https://stackoverflow.com/questions/22181944/using-utf-8-characters-in-a-jinja2-template/22182709

for filename in os.listdir('raw_notes'):
  with open(os.getcwd() + '/raw_notes/' + filename, 'r') as file_in:
    content = file_in.readlines()
    raw_notes = ''.join(content[2:])
    rendered = template.render(title=content[0].strip(), summary=content[1].strip(),
                               short_summary=content[2].strip(), raw_notes=raw_notes.decode('utf-8'))
    with open(os.getcwd() + '/book/' + filename + '.html', 'w+') as file_out:
      file_out.write(rendered.encode('utf-8'))
