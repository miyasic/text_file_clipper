chrome.downloads.onChanged.addListener((downloadDelta) => {
  if (downloadDelta.state && downloadDelta.state.current === 'complete') {
    (async () => {
      chrome.downloads.search({id: downloadDelta.id}, async (downloads) => {
        if (downloads && downloads.length > 0) {
          const file = downloads[0];
          const filepath = file.filename;
          if(file.mime && file.mime.startsWith('text/')) {
            fetch(`file://${filepath}`).then(response => response.arrayBuffer()).then(async (data) => {
              const decoder = new TextDecoder('shift-jis');
              const text = csvToTsv(file.mime,decoder.decode(data));
              const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
              const response = await chrome.tabs.sendMessage(tab.id, { message: 'downloadComplete', filepath: filepath, content: text });
            });
          }
        }
      });
    })();
  }
});

function csvToTsv(mime, text) {
  if (mime == 'text/csv') {
    console.log("CSVファイルなので、TSVに変換");
    return text.replaceAll(',', '\t');
  }
  console.log("CSVファイルではないので、そのまま返却");
  return text;
}

