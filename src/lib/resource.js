var getType = function(string) {
    if (string.match(/download.mp4/i)) {
        return "video";
    }
    if (string.match(/subtitles.*format=srt/i)) {
        return "srt";
    }
    if (string.match(/subtitles.*format=txt/i)) {
        return "txt";
    }
    if (string.match(/quiz\/start/i)) {
        return "quiz";
    }
    return "slide";
};

var getResources = function (lecture) {
    var resources = lecture.parentNode.querySelector(".course-lecture-item-resource");
    var list = {
        hack: [lecture.getAttribute("data-modal-iframe").trim()]
    };
    Array.prototype.forEach.call(resources.children, function(item) {
        if (!list[getType(item.href)])
            list[getType(item.href)] = []
        list[getType(item.href)].push(item.href.trim());
    });
    return list;
};

var getLecture = function(sections) {
    return Array.prototype.map.call(sections.nextSibling.querySelectorAll(".lecture-link"), function(lecture) {
        return {
            title     : lecture.textContent.trim(),
            resources : getResources(lecture)
            //video: lecture.getAttribute("data-modal-iframe").trim()
        };
    });
};

var getSections = function() {
    return Array.prototype.map.call(document.querySelectorAll(".course-item-list-header"), function(section) {
        return {
            title    : section.querySelector("h3").textContent.trim(),
            lectures : getLecture(section)
        };
    });
};

chrome.runtime.sendMessage({
    course   : document.querySelector(".course-topbanner-name").textContent.trim(),
    sections : getSections()
});