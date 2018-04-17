import os
from bs4 import BeautifulSoup

# TODO: All except raw_notes should be one-liners

def strip_and_one_line(text):
  return ' '.join([x.strip() for x in text.split('\n')]).lstrip().rstrip()

for filename in os.listdir('book'):
  with open(os.getcwd() + '/book/' + filename, 'r') as file_in:
    content = ''.join(file_in.readlines())
    soup = BeautifulSoup(content, 'html.parser')
    title = strip_and_one_line(soup.title.get_text().replace(' - Highlights and Notes', ''))
    raw_notes = soup.find(id='raw-notes').get_text().lstrip().rstrip()
    raw_notes = '\n'.join([x.strip() for x in raw_notes.split('\n')])
    summary = strip_and_one_line(soup.find('div', class_='summary').p.get_text())
    short_summary = strip_and_one_line(
      soup.find('meta', attrs={'name':'description'}).attrs['content'].replace('TLDR: ', ''))
    with open(os.getcwd() + '/raw_notes/' + filename.replace('.html', ''), 'w+') as file_out:
      file_out.write(title + '\n')
      file_out.write(summary + '\n')
      file_out.write(short_summary + '\n')
      file_out.write(raw_notes.encode('utf-8'))
