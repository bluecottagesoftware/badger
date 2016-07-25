// There's probably a better way for this but I cbf
// http://cwestblog.com/2013/02/26/javascript-string-prototype-matchall/
// Thanks Chris West.
String.prototype.matchAll = function(regexp) {
  var matches = [];
  this.replace(regexp, function() {
    var arr = ([]).slice.call(arguments, 0);
    var extras = arr.splice(-2);
    arr.index = extras[0];
    arr.input = extras[1];
    matches.push(arr);
  });
  return matches.length ? matches : null;
};

loadFontAwesome = function() {
    link = document.createElement( "link" );
    link.href  = "https://maxcdn.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css";
    link.type  = "text/css";
    link.rel   = "stylesheet";
    link.media = "screen,print";

    document.getElementsByTagName( "head" )[0].appendChild( link );
};

awesomeIcon = function(iconName) {
    icon = document.createElement("i");
    icon.classList.add("fa");
    icon.classList.add("fa-" + iconName);

    return icon;
};

newBadge = function(text, icon, fontColor, badgeColor, fontSize, fontWeight) {
    badge = document.createElement("div");
    badge.classList.add("pointy-badge");
    badge.classList.add("badge");

    badge.style.color = fontColor;
    badge.style.backgroundColor = badgeColor;
    badge.style.fontSize = fontSize;
    badge.style.fontWeight = fontWeight;

    badge.innerHTML = awesomeIcon(icon).outerHTML;
    badge.innerHTML += " " + text;

    return badge;
};

refreshCycle = function(meta, config) {
    for (var i = 0; i < meta.lists.length; i++) {
        meta.lists[i].clear();
    }

    for (i = 0; i < meta.lists.length; i++) {
        meta.lists[i].process(config);
    }

    // setTimeout(function() {
    //      refreshCycle(meta);
    //}, 2500);
};

loadMeta = function(meta) {
    meta.lists    = [];
    var lists     = [];
    var listNodes = Array.prototype.slice.call(document.getElementsByClassName("list"));
    listNodes.forEach(function(listNode) {
        if (listNode.classList.contains("add-list")) {
            return;
        }

        var list = new List(0, listNode, []);
        var cardNodes = Array.prototype.slice.call(list.node.getElementsByClassName("list-card"));
        cardNodes.forEach(function(cardNode) {
            list.cards.push(new Card(cardNode));
        });

        meta.lists.push(list);
    });
};

start = function(config) {
    loadFontAwesome();

    var meta = {
        lists: []
    };
    loadMeta(meta);
    refreshCycle(meta, config);
};

storageCallback = function(result) {
    if (result.badgerConfig) {
        // Calling it here messes up the console output for errors... :\
        config = result.badgerConfig;
        config = JSON.parse(config);
        for (var i = 0; i < config.listBadges.length; i++) {
            // TODO: Perhaps there is a way to gain similar functionality without eval.
            config.listBadges[i].reduce = eval("(" + config.listBadges[i].reduce + ")");
        }
        for (i = 0; i < config.cardBadges.length; i++) {
            config.cardBadges[i].regex = new RegExp(config.cardBadges[i].regex, "g");
        }

        start(config);
    }

    return;
};

loadConfig = function() {
    chrome.storage.sync.get("badgerConfig", storageCallback);
};

window.onload = loadConfig;
