let shadowRoot = chrome.dom.openOrClosedShadowRoot(document.querySelector('span'))
shadowRoot.querySelector('input').value = "hello world"