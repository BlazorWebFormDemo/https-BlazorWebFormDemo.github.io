function WebForm_FindFirstFocusableChild(control) {
    if (!control || !(control.tagName)) {
        return null;
    }
    var tagName = control.tagName.toLowerCase();
    if (tagName == "undefined") {
        return null;
    }
    var children = control.childNodes;
    if (children) {
        for (var i = 0; i < children.length; i++) {
            try {
                if (WebForm_CanFocus(children[i])) {
                    return children[i];
                }
                else {
                    var focused = WebForm_FindFirstFocusableChild(children[i]);
                    if (WebForm_CanFocus(focused)) {
                        return focused;
                    }
                }
            } catch (e) {
            }
        }
    }
    return null;
}
function WebForm_FindTargetById(focusId) {
    if (__nonMSDOMBrowser) {
        return document.getElementById(focusId);
    }
    else {
        return document.all[focusId];
    }
}
function WebForm_FindTargetByName(focusName) {
    var elements = document.getElementsByName(focusName);
    return elements.length > 0 ? elements[0] : null;
}
function WebForm_AutoFocus(focusId, useName) {
    var targetControl;
    if (useName && __nonMSDOMBrowser) {
        targetControl = WebForm_FindTargetByName(focusId);
    }
    else {
        targetControl = WebForm_FindTargetById(focusId);
    }
    var focused = targetControl;
    if (targetControl && (!WebForm_CanFocus(targetControl)) ) {
        focused = WebForm_FindFirstFocusableChild(targetControl);
    }
    if (focused) {
        try {
            focused.focus();
            if (__nonMSDOMBrowser) {
                focused.scrollIntoView(false);
            }
            if (window.__smartNav) {
                window.__smartNav.ae = focused.id;
            }
        }
        catch (e) {
        }
    }
}
function WebForm_CanFocus(element) {
    if (!element || !(element.tagName)) return false;
    var tagName = element.tagName.toLowerCase();
    return (!(element.disabled) &&
            (!(element.type) || element.type.toLowerCase() != "hidden") &&
            (WebForm_IsFocusableTag(tagName) || element.hasAttribute("contenteditable")) &&
            WebForm_IsInVisibleContainer(element)
            );
}
function WebForm_IsFocusableTag(tagName) {
    return (tagName == "input" ||
            tagName == "textarea" ||
            tagName == "select" ||
            tagName == "button" ||
            tagName == "a");
}
function WebForm_IsInVisibleContainer(ctrl) {
    var current = ctrl;
    while((typeof(current) != "undefined") && (current != null)) {
        if (current.disabled ||
            ( typeof(current.style) != "undefined" &&
            ( ( typeof(current.style.display) != "undefined" &&
                current.style.display == "none") ||
                ( typeof(current.style.visibility) != "undefined" &&
                current.style.visibility == "hidden") ) ) ) {
            return false;
        }
        if (typeof(current.parentNode) != "undefined" &&
                current.parentNode != null &&
                current.parentNode != current &&
                current.parentNode.tagName.toLowerCase() != "body") {
            current = current.parentNode;
        }
        else {
            return true;
        }
    }
    return true;
}
