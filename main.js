chrome.contextMenus.create({
    title: "Search in UrbanDictionary",
    contexts: ["selection"],  // ContextType
    onclick: () => {
        console.log('coucou')
    } // A callback function
});