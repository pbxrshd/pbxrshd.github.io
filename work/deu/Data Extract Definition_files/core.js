/*
 common client side functionality

 requires:prototype.js
*/

var RESPONSE_STATUS_SUCCESS = "SUCCESS";
var RESPONSE_STATUS_FAILURE = "FAILURE";

function selectAll() {
    overviewSelectAll();
    jQuery('.selectAll').each(function(index, value) { rowSelect(jQuery(value)); });
}

function rowSelect(row) {
    row.next().attr('value', row[0].checked);
}

function overviewSelectAll(group) {
    var groupName = group || "";
    var isMasterChecked=document.getElementsByClassName('selectAllMaster' + groupName)[0].checked;
    $A(document.getElementsByClassName('selectAll' + groupName)).each(function(e){e.checked=isMasterChecked;});
}

function addLoadEvent(func) {
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
        window.onload = func;
    } else {
        window.onload = function () {
            if (oldonload) {
                oldonload();
            }
            func();
        }
    }
}

function getInternetExplorerVersion() {
    var rv = -1; // Return value assumes failure.
    if (navigator.appName == 'Microsoft Internet Explorer') {
        var ua = navigator.userAgent;
        var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) != null)
            rv = parseFloat(RegExp.$1);
    }
    return rv;
}

/**
*  adds setValue counterpart toprototype.js getValue.
*  implementation not complete!!
*  for now only works for dropdowns
*/
function setValue(element, valueToSet) {
    var elementRef = $(element);
    if (("SELECT" == elementRef.tagName)) {
        for (var i = 0; i < elementRef.options.length; i++) {
            if (valueToSet == elementRef.options[i].value) {
                elementRef.options[i].selected = true;
                break; //out of for loop
            }
        }
    }
}

function confirmDialog(message) {
    return confirm(message);
}

// Used to pop-up the neg val hit screen
//     takes in:
//       context  - the base context
//       transId  - the transaction id
//       vcId     - a virtual column id
//       negHitId - the id of the neg value that was hit
//       detailId - optional - the id of the negative row where value was hit
function popupNegValDetails(context, transId, vcId, negHitId, detailId, bucketId) {
    return popupNegValDetailsWithSuppliedValues(context, transId, vcId, negHitId, detailId, bucketId, {});
}

function popupNegValDetailsWithSuppliedValues(context, transId, vcId, negHitId, detailId, bucketId, suppliedValues) {

    var requestString = context;
    requestString += '/jsp/agent/queue/negativeHitDetails.jsf';
    requestString += '?transId=' + transId;
    requestString += '&vcId=' + vcId;
    requestString += '&negHitId=' + negHitId;
    if (detailId != null && detailId != '') {
        requestString += '&detailId=' + detailId;
    }
    if (bucketId != null && bucketId != '') {
        requestString += '&bucketId=' + bucketId;
    }

    // now gather each property of the suppliedValues and tack those on as request parameters
    for (var name in suppliedValues) {
        // ignore inherited properties with this line
        if (suppliedValues.hasOwnProperty(name)) {
          // get the value of the object stored at that name
            var value = suppliedValues[name];
            requestString += "&" + name + "=" + value;
        }
    }

    // give the window unique to this transaction and negative value combination
    var windowId = 'transId' + transId + 'negHitId' + negHitId;

    // alert("unique window id is: [" + windowId + "]");

    var myWindow
        = window.open(requestString,
                      windowId,
                      'status=0,location=0,directories=0,menubar=0,toolbar=0,width=450,height=450,resizable=1');
}

// TODO comment
function popupShareNegValDetailsNoBucket(context, transId, vcId) {
    popupShareNegValDetails(context, transId, vcId, null);
}

function popupShareNegValDetails(context, transId, vcId, bucketId) {
    var requestString = context;
    requestString += '/jsp/agent/queue/shareNegativeHitDetails.jsf';
    requestString += '?transId=' + transId;
    requestString += '&vcId=' + vcId;
    if (bucketId != null) {
        requestString += "&bucketId=" + bucketId;
    }

    // give the window unique to this transaction and negative value combination
    var windowId = 'transId' + transId;
    var myWindow
        = window.open(requestString,
                      windowId,
                      'status=0,location=0,directories=0,menubar=0,toolbar=0,width=450,height=450,resizable=1');
}

function popupSimilarTransactionsBase(context, transId, detailId, vcId, bucketId) {
    var requestString = context;
    requestString += '/jsp/agent/queue/similarTransactions.jsf';
    requestString += '?transId=' + transId;
    requestString += '&detailId=' + detailId;
    requestString += '&vcId=' + vcId;
    requestString += '&bucketId=' + bucketId;

    // give the window unique to this transaction and virtual column combination
    var windowId = "transId" + transId + "detailId" + detailId + "vcId" + vcId;

    //alert("unique window id is: [" + windowId + "]");

    var myWindow
        = window.open(requestString,
                      windowId,
                      'status=0,location=0,directories=0,menubar=0,toolbar=0,width=600,height=400,resizable=1,scrollbars=1');
}

function popupBounce(context, transId, rfId, bucketId, valueId, detailRecordId) {
    return popupBounceWithSuppliedValues(context, transId, rfId, bucketId, valueId, detailRecordId, {});
}

function popupBounceWithSuppliedValues(context, transId, rfId, bucketId, valueId, detailRecordId, suppliedValues) {
    var requestString = context;
    requestString += '/jsp/agent/bounce.jsf';
    requestString += '?transId=' + transId;
    requestString += '&reviewFunctionId=' + rfId;
    requestString += '&bucketId=' + bucketId;
    requestString += '&linkFieldName=link1_text';
    requestString += '&value=' + valueId;
    if (detailRecordId != null) {
        requestString += '&detailRecordId=' + detailRecordId;
    }

    // now gather each property of the suppliedValues and tack those on as request parameters
    for (var name in suppliedValues) {
        // ignore inherited properties with this line
        if (suppliedValues.hasOwnProperty(name)) {
          // get the value of the object stored at that name
            var value = suppliedValues[name];
            requestString += "&" + name + "=" + value;
        }
    }

    // give the window unique to this transaction and virtual column combination
    var windowId = "transId" + transId + "reviewFunctionId" + rfId;

    // alert("unique window id is: [" + windowId + "]");

    var myWindow
        = window.open(requestString,
                      windowId,
                      'status=0,location=0,directories=0,menubar=0,toolbar=0,width=450,height=300,resizable=1');
}
//
// getPageSize()
// Returns array with page width, height and window width, height
// Core code from - quirksmode.org
// Edit for Firefox by pHaez
//
function getPageSize(parent) {
    parent = parent || document.body;
    var windowWidth, windowHeight;
    var pageHeight, pageWidth;

    if (parent != document.body) {
        windowWidth = parent.getWidth();
        windowHeight = parent.getHeight();
        pageWidth = parent.scrollWidth;
        pageHeight = parent.scrollHeight;
    } else {
        var xScroll, yScroll;

        if (window.innerHeight && window.scrollMaxY) {
            xScroll = document.body.scrollWidth;
            yScroll = window.innerHeight + window.scrollMaxY;
        } else if (document.body.scrollHeight > document.body.offsetHeight) { // all but Explorer Mac
            xScroll = document.body.scrollWidth;
            yScroll = document.body.scrollHeight;
        } else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
            xScroll = document.body.offsetWidth;
            yScroll = document.body.offsetHeight;
        }

        if (self.innerHeight) { // all except Explorer
            windowWidth = self.innerWidth;
            windowHeight = self.innerHeight;
        } else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
            windowWidth = document.documentElement.clientWidth;
            windowHeight = document.documentElement.clientHeight;
        } else if (document.body) { // other Explorers
            windowWidth = document.body.clientWidth;
            windowHeight = document.body.clientHeight;
        }

        // for small pages with total height less then height of the viewport
        if (yScroll < windowHeight) {
            pageHeight = windowHeight;
        } else {
            pageHeight = yScroll;
        }

        // for small pages with total width less then width of the viewport
        if (xScroll < windowWidth) {
            pageWidth = windowWidth;
        } else {
            pageWidth = xScroll;
        }
    }
    return {pageWidth: pageWidth, pageHeight: pageHeight, windowWidth: windowWidth, windowHeight: windowHeight};
}

function getWindowScroll(parent) {
    var T, L, W, H;
    parent = parent || document.body;
    if (parent != document.body) {
        T = parent.scrollTop;
        L = parent.scrollLeft;
        W = parent.scrollWidth;
        H = parent.scrollHeight;
    }
    else {
        var w = window;
        with (w.document) {
            if (w.document.documentElement && documentElement.scrollTop) {
                T = documentElement.scrollTop;
                L = documentElement.scrollLeft;
            }
            else if (w.document.body) {
                T = body.scrollTop;
                L = body.scrollLeft;
            }
            if (w.innerWidth) {
                W = w.innerWidth;
                H = w.innerHeight;
            }
            else if (w.document.documentElement && documentElement.clientWidth) {
                W = documentElement.clientWidth;
                H = documentElement.clientHeight;
            }
            else {
                W = body.offsetWidth;
                H = body.offsetHeight
            }
        }
    }
    return {top: T, left: L, width: W, height: H};
}

// Registers with all ajax calls on the screen to show a wait cursor centered on
// the screen when an ajax call begins, then hide the cursor when the call completes
//
// To use this method, you must also include the following block somewhere in your page:
//
// <div id="waitCursorId" style="display:none; position:absolute; border-style: none; background-color: transparent; padding: 0px;">
//     <img src="/unsecured/images/cursor-wait.gif">
// </div>

function showWaitCursorForAllAjaxCalls() {
    // this block will show a wait cursor while the ajax call is processing,
    // and then hide it when the call has completed
    Ajax.Responders.register({
        // this block executes right as the ajax request is starting
        onCreate: function () {
            var windowLeftMiddle = null;
            var windowTopMiddle = null;

            // make a call to common.js to get the page dimensions
            var pageDimensions = getPageSize();

            // the call returns an object with four attributes:
            //     pageWidth
            //     pageHeight
            //     windowWidth
            //     windowHeight

            // make a call to common.js to get the page scroll
            // the call returns an object with four attributes:
            //     top
            //     left
            //     width
            //     height
            var pageScroll = getWindowScroll();

            windowLeftMiddle = pageDimensions.windowWidth / 2;
            windowTopMiddle = pageDimensions.windowHeight / 2;

            // get reference to the wait cursor div
            var busyCursor = $('waitCursorId');

            busyCursor.setStyle(
                {
                    left: (windowLeftMiddle + pageScroll.left - 25) + "px",
                    top: (windowTopMiddle + pageScroll.top - 25) + "px"
                }
            );

            Effect.Appear('waitCursorId', {duration: 0.3, queue: 'end'});
        },
        // this block executes right as the ajax request is complete
        onComplete: function () {
            Effect.Fade('waitCursorId', {duration: 0.3, queue: 'end'});
        }

    });
}

function scrollToTop() {
    var x1 = x2 = x3 = 0;
    var y1 = y2 = y3 = 0;

    if (document.documentElement) {
        x1 = document.documentElement.scrollLeft || 0;
        y1 = document.documentElement.scrollTop || 0;
    }

    if (document.body) {
        x2 = document.body.scrollLeft || 0;
        y2 = document.body.scrollTop || 0;
    }

    x3 = window.scrollX || 0;
    y3 = window.scrollY || 0;

    var x = Math.max(x1, Math.max(x2, x3));
    var y = Math.max(y1, Math.max(y2, y3));

    window.scrollTo(Math.floor(x / 2), Math.floor(y / 2));

    if (x > 0 || y > 0) {
        window.setTimeout("scrollToTop()", 20);
    }
}

var unauthorizedAccess = false;

function hasParameterWarnings(ajaxResponse) {
    try {
        // alert("got back a response: " + ajaxResponse.responseText);

        // parse the response into a JSON object for easier manipulation
        var jsonResponse = ajaxResponse.responseText.evalJSON();

        // alert("mapped response to json object: " + jsonResponse);

        var arrayOfErrorMessages = jsonResponse.arrayOfErrorMessages;
        // alert("arrayOfErrorMessages = " + arrayOfErrorMessages);

        if (arrayOfErrorMessages != null && arrayOfErrorMessages.length > 0) {
            var errorMessage = "ERROR: There was an issue processing your request:\n\n";
            for (var i = 0; i < arrayOfErrorMessages.length; i++) {
                errorMessage += "  *  " + arrayOfErrorMessages[i] + "\n";
            }

            // if they have not yet been alerted, tell them they were bad
            if (unauthorizedAccess == false) {
                // take note of the fact they are being warned once
                unauthorizedAccess = true;
                // if they have done something inappropriate, don't show the screen
                $('mainContentDiv').hide();
                $('mainContentDiv').remove();

                // and tell them that they can't access that
                alert(errorMessage);
            }

            return true;
        }
    }
    catch (e) {
        // if the response cannot even be parsed as JSON, it could not have
        // been a paramter problem -
        // just let it go...
    }

    //
    return false;
}

/************************************************************/
/*
 Initializes a new instance of the StringBuilder class and appends the given value if supplied.
 usage:
 var sb = new StringBuilder();
 var sb = new StringBuilder('zero');
 sb.append('one').append('two').append('three');
 alert(sb);
*/
function StringBuilder(value) {
    this.strings = new Array("");
    this.append(value);
}
// appends the given value to the end of this instance.
StringBuilder.prototype.append = function(value){if(value)this.strings.push(value);return this;}
// clears the string buffer.
StringBuilder.prototype.clear = function(){this.strings.length = 1;}
// converts this instance to a String (overrides String.toString).
StringBuilder.prototype.toString = function(){return this.strings.join("");}
/************************************************************/

/** Used to tell if this form has been submitted */
var HAS_FORM_BEEN_SUBMITTED = false;
function doAllowSubmit() {
    if( HAS_FORM_BEEN_SUBMITTED ) {
        return false;
    } else {
        HAS_FORM_BEEN_SUBMITTED = true;
        return true;
    }
}

function getInnerText(elementRef) {
    if (elementRef.innerText) { // IE;
        return elementRef.innerText;
    } else if (elementRef.textContent) {
        return elementRef.textContent;
    } else {
        return '';
        //alert('error applying getInnerText to ' + elementRef);
    }

}

//***************************************************************************
//
// Allows a group of radio buttons to be unchecked by clicking on the
// already checked value again.
//
function allowRadioUnchecks(radioGroupName) {

    // get the radio buttons in the group
    var radios = document.getElementsByName(radioGroupName);
 
    for (var i = 0; i < radios.length; i++) {
        var radio = $(radios[i]);

        // on mousedown, track if it was already checked
        radio.observe('mousedown', function() {
            if (this.checked) {
                this.writeAttribute('alreadyChecked', 'yes');
            } else {
                this.writeAttribute('alreadyChecked', 'no');
            }
        } );
        
        // on mouse up, check to see if it had previously been checked
        // if so, uncheck the whole group
        radio.observe('mouseup', function() {
            var already = this.readAttribute('alreadyChecked');
            if (already != null && already == 'yes') {
                var uncheckAll = function() {
                    for (var j = 0; j < radios.length; j++) {
                        radios[j].checked = false;
                    }
                };
                // the timeout is needed to ensure the uncheck
                // happens _AFTER_ the onclick event
                setTimeout(uncheckAll, 100);
                var blurIt = function() {
                    radio.blur();
                };
                setTimeout(blurIt, 120);
            }
        });
    }
}

var transactionViewMode = false;
var transactionViewOneMode = false;
var transactionIdMode = false;
var showStateMode = false;
var showFlexValues = true;

function isShowingFlexValues() {
    return showFlexValues;
}

function initAltModes() {
    document.onkeydown = function(e) { 
        e = e || window.event;

        // figure out which key was pressed
        if (e.keyCode) code = e.keyCode;
        else if (e.which) code = e.which;
        var character = String.fromCharCode(code).toLowerCase();

        if (!transactionViewMode) {
            if (e.altKey && e.ctrlKey && character == 'v') {
                transactionViewMode = true;
                findTransactionLinks().each(function(link) { toggleViewModeLink(link); });
            }
        } else {
            if (e.altKey && e.ctrlKey && character == 'v') {
                findTransactionLinks().each(function(link) { toggleViewModeLink(link); });
                transactionViewMode = false;
            }
        }
        if (!transactionViewOneMode) {
            if (e.altKey && e.ctrlKey && character == 'o') {
                transactionViewOneMode = true;
                findTransactionLinks().each(function(link) { toggleViewOneTransactionModeLink(link); });
            }
        } else {
            if (e.altKey && e.ctrlKey && character == 'o') {
                findTransactionLinks('viewSingleTran\.jsf\\?hid.').each(function(link) { toggleViewOneTransactionModeLink(link); });
                transactionViewOneMode = false;
            }
        }
        if (!transactionIdMode) {
            if (e.altKey && e.ctrlKey && character == 'i') {
                transactionIdMode = true;
                findTransactionLinks().each(function(link) { toggleIdMode(link); });
            }
        } else {
            if (e.altKey && e.ctrlKey && character == 'i') {
                findTransactionLinks().each(function(link) { toggleIdMode(link); });
                transactionIdMode = false;
            }
        }

        if (!showStateMode) {
            if (e.altKey && e.ctrlKey && character == 's') {
                showStateInformation();
            }
        } else {
            if (e.altKey && e.ctrlKey && character == 's') {
                hideStateInformation();
            }
        }
        
        if (e.altKey && e.ctrlKey && character == 'f') {
        	showFlexValues = !showFlexValues;
        	toggleFlex();
        	flexValuesToggled();
        }
    }
}

function showStateInformation() {
}
function hideStateInformation() {
}

var flexValuesToggled = function() {
    //no-op (can be overriden)
};

function toggleViewModeLink(link) {
    // look to see if it has the origUrl attribute
    var origUrl = link.readAttribute('origUrl');

    if (origUrl != null && origUrl != '') {
        // put the orig url back
        link.href = origUrl;

        // remove the attribute
        link.writeAttribute('origUrl', '');   

        // and make it look normal again
        link.removeClassName('viewmodelink');

    } else {
        // tack onto the url to make the link click into view mode
        var suffix = "&mode=V";
        // if there is no ? in it, the suffix must use ?
        if (link.href.indexOf('?') < 0) {
            suffix = '?mode=V';
        }
        
        // hang onto its original url
        link.writeAttribute('origUrl', link.href);
        if (!link.href.endsWith('#')) {
            // give it a new look to make it stand out
            link.addClassName('viewmodelink');
        }
        // append the view logic to the url
        link.href = link.href + suffix;
    }
}

/*
TODO: INT-1303: delete functions initNewLayout, toggleNewLayoutLink, and newLayoutlink css class
 adding separate function for layout permission broke the binding for 'initAltModes' so we need to duplicate it here to make it work again
 */
var newLayoutMode = false;
function initNewLayout() {
    document.onkeydown = function(e) {
        e = e || window.event;

        // figure out which key was pressed
        if (e.keyCode) {
            code = e.keyCode;
        } else if (e.which) {
            code = e.which;
        }
        var character = String.fromCharCode(code).toLowerCase();

        if (!transactionViewMode) {
            if (e.altKey && e.ctrlKey && !e.shiftKey && character === 'v') {
                transactionViewMode = true;
                findTransactionLinks().each(function(link) { toggleViewModeLink(link); });
            }
        } else {
            if (e.altKey && e.ctrlKey && !e.shiftKey && character === 'v') {
                findTransactionLinks().each(function(link) { toggleViewModeLink(link); });
                transactionViewMode = false;
            }
        }
        if (!transactionViewOneMode) {
            if (e.altKey && e.ctrlKey && character == 'o') {
                transactionViewOneMode = true;
                findTransactionLinks().each(function(link) { toggleViewOneTransactionModeLink(link); });
            }
        } else {
            if (e.altKey && e.ctrlKey && character == 'o') {
                findTransactionLinks('viewSingleTran\.jsf\\?hid.').each(function(link) { toggleViewOneTransactionModeLink(link); });
                transactionViewOneMode = false;
            }
        }
        if (!transactionIdMode) {
            if (e.altKey && e.ctrlKey && character == 'i') {
                transactionIdMode = true;
                findTransactionLinks().each(function(link) { toggleIdMode(link); });
            }
        } else {
            if (e.altKey && e.ctrlKey && character == 'i') {
                findTransactionLinks().each(function(link) { toggleIdMode(link); });
                transactionIdMode = false;
            }
        }

        if (!showStateMode) {
            if (e.altKey && e.ctrlKey && character == 's') {
                showStateInformation();
            }
        } else {
            if (e.altKey && e.ctrlKey && character == 's') {
                hideStateInformation();
            }
        }

        if (e.altKey && e.ctrlKey && character == 'f') {
            showFlexValues = !showFlexValues;
            toggleFlex();
            flexValuesToggled();
        }

        if (!newLayoutMode) {
            if (e.altKey && e.ctrlKey && e.shiftKey && (character === 'v' || character === 'n')) {
                newLayoutMode = true;
                findTransactionLinks().each(function(link) {
                    toggleNewLayoutLink(link, character === 'v');
                });
            } else if (window.location.pathname.match(/.*transactiondetail\.jsf.*/g) && e.altKey && e.ctrlKey && e.shiftKey && character == 'g') {
                switchToNewLayout(window.location.href);
            }
        } else {
            if (e.altKey && e.ctrlKey && e.shiftKey && (character === 'v' || character === 'n')) {
                findTransactionLinks('.*entry#\/transaction\/([0-9]+)\/([1-7]+).*').each(function(link) {
                    toggleNewLayoutLink(link)
                });
                newLayoutMode = false;
            }
        }

    }
}

function toggleNewLayoutLink(link, viewMode) {
    // look to see if it has the origUrl attribute
    var origUrl = link.readAttribute('origUrl');

    if (origUrl != null && origUrl != '') {
        // put the orig url back
        link.href = origUrl;

        // remove the attribute
        link.writeAttribute('origUrl', '');

        // and make it look normal again
        link.removeClassName('newLayoutLink');
        link.removeClassName('viewLayoutLink');

    } else {
        var path = ['-1', '1', 'w'],
            patterns = [
            /.*transactiondetail\.jsf\?.*transId=([0-9]+).*/g,
            /.*transactiondetail\.jsf\?.*bucketId=([1-7]+).*/g,
            /.*transactiondetail\.jsf\?.*mode=([a-zA-Z]+).*/g
        ];

        for (var i = 0; i < patterns.length; i++) {
            var match = patterns[i].exec(link.href);
            if (match && match.length == 2) {
                path[i] = match[1];
            }
        }

        // checking if href ends with '#' to prevent styling links with page bookmarks, e.g. <a href="#" onclick="goToMindTouch()">Success Center</a>
        if (!link.href.endsWith('#')) {
            // give it a new look to make it stand out
            link.addClassName(viewMode ? 'viewLayoutLink' : 'newLayoutLink');
        }

        // hang onto its original url
        link.writeAttribute('origUrl', link.href);

        if (!location.origin) { // if IE
            location.origin = location.protocol + "//" + location.host;
        }
        link.href = location.origin + '/maintain/interceptas/entry#/transactionview/' + path[0] + '/' + path[1] + '/' + (viewMode ? 'V' : path[2]);

    }
}

function switchToNewLayout(currentUrl) {
    var path = ['-1', '1', 'w'], pattern = [], switchUrl = currentUrl+'', mode='';

    if (!location.origin) { // if IE
        location.origin = location.protocol + "//" + location.host;
    }

    if (currentUrl.match(/.*entry#\/transaction\/([0-9]+)\/([1-7]+).*/g)) {
        // angular pattern
        pattern = [
            /.*entry#\/transaction\/([0-9]+)\/[1-7]+\/[a-zA-Z]+.*/g,
            /.*entry#\/transaction\/[0-9]+\/([1-7]+)\/[a-zA-Z]+.*/g,
            /.*entry#\/transaction\/[0-9]+\/[1-7]+\/([a-zA-Z]+).*/g
        ];
    } else if (currentUrl.match(/.*transactiondetail\.jsf\?.*transId=([0-9]+).*/g)) {
        // old key=value pattern
        pattern = [
            /.*transactiondetail\.jsf\?.*transId=([0-9]+).*/g,
            /.*transactiondetail\.jsf\?.*bucketId=([1-7]+).*/g,
            /.*transactiondetail\.jsf\?.*mode=([a-zA-Z]+).*/g
        ];
    } else {
        return;
    }

    for (var i = 0; i < pattern.length; i++) {
        var match = pattern[i].exec(currentUrl);
        if (match && match.length == 2) {
            path[i] = match[1];
        }
    }

    if (currentUrl.match('.*entry#\/transaction\/([0-9]+)\/([1-7]+).*')) {
        if (path[2] === 'w' || path[2] === 'W') {
            mode = ''
        } else {
            mode = '&mode=' + path[2];
        }
        switchUrl = location.origin + '/transactiondetail.jsf?transId=' + path[0] + '&bucketId=' + path[1] + mode;
    } else {
        switchUrl = location.origin + '/maintain/interceptas/entry#/transactionview/' + path[0] + '/' + path[1] + '/' + path[2]
    }
    window.location = switchUrl;

}

function toggleIdMode(link) {
    // look to see if it has the originnerhtml attribute
    var origInnerHtml = link.readAttribute('origInnerHtml');

    if (origInnerHtml != null && origInnerHtml != '') {
        // put the orig url back
        link.update( origInnerHtml );
        
        // remove the attribute
        link.writeAttribute('origInnerHtml', '');   
        
        // and make it look normal again
        link.removeClassName('idmodelink');
    } else {
        // swap the inner html with the tran id
        // regex detailing link href pattern that indicates a link to a transaction
        var re = new RegExp('(.*)agent.queue.transactiondetail\.jsf\\?transId.([0-9]+)');
        var regexMatch = re.exec(link.href);

        // hang onto its origInnerHtml
        link.writeAttribute('origInnerHtml', link.innerHTML);  

        // give it a new look to make it stand out
        if (!link.href.endsWith('#')) {
            // give it a new look to make it stand out
            link.addClassName('idmodelink');
            var transactionId = regexMatch[2];

            // append the view logic to the url
            link.update(transactionId);
        }
    }
}

function toggleViewOneTransactionModeLink(link) {
    // look to see if it has the origUrl attribute
    var origUrl = link.readAttribute('origUrl2');

    if (origUrl != null && origUrl != '') {
        // put the orig url back
        link.href = origUrl;
        
        // remove the attribute
        link.writeAttribute('origUrl2', '');   
        
        // and make it look normal again
        link.removeClassName('viewonetransactionmodelink');
    } else {
        // hang onto its original url
        link.writeAttribute('origUrl2', link.href);  

        // give it a new look to make it stand out
        if (!link.href.endsWith('#')) {
            link.addClassName('viewonetransactionmodelink');
        }
        // regex detailing link href pattern that indicates a link to a transaction
        var re = new RegExp('(.*)agent.queue.transactiondetail\.jsf\\?transId.([0-9]+)');
        var regexMatch = re.exec(link.href);
        var baseUrl = regexMatch[1];
        var transactionId = regexMatch[2];
        
        // append the view logic to the url
        link.href = baseUrl + 'other/viewSingleTran.jsf?hid=' + transactionId;
    }
}

function findTransactionLinks(regexpString) {
    if (regexpString == null || regexpString == '') {
        regexpString = 'transactiondetail\.jsf\\?transId.';
    }
 
    // regex detailing link href pattern that indicates a link to a transaction
    var re = new RegExp(regexpString);
 
    var links = $A();

    // find all links on the page
    $$('a').each(function(link) {
        // narrow it down to those with hrefs
        if (link.href) {
            var regexMatch = re.exec(link.href);
            if (regexMatch) {
                links.push(link);
            }
        }
    });
    return links;
}

function toggleFlex() {
    $$('span.flex_translation').each(
        function(item) {

            var content = item.innerHTML;
            var title = item.title;

            item.update(title);
            item.writeAttribute('title', content);
        }
    );
    return false;
} 

/**
*
*  Base64 encode / decode
*  http://www.webtoolkit.info/
*
**/

var Base64 = {

    // private property
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    // public method for encoding
    encode: function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
                this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

        }

        return output;
    },

    // public method for decoding
    decode: function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = Base64._utf8_decode(output);

        return output;
    },

    // private method for UTF-8 encoding
    _utf8_encode: function (string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }
        return utftext;
    },

    // private method for UTF-8 decoding
    _utf8_decode: function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while (i < utftext.length) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }
        return string;
    }
};

//***************************************************************************
//
// Given the name of a table, find the child TBODY tag inside which acutally
// has content in it. This is needed due to IE non-compliance with DOM manipulation
// standards. For some reason, IE always tacks on its own TBODY tag when you
// create a table...
//
function getUtilizedTableBodyFromTable(tableId) {
    var theTable = $(tableId);

    // because IE always puts its own TBODY tag in, we need to find WHICH TBODY to append to
    // (since there will be two of them in IE, but only one in Firefox)
    var theTableBody = null;
    if (Prototype.Browser.IE) {
        // first, gather up all of the TBODY tags (there will be two, trust me)
        var tableBodies = getImmediateDescendantsOfType(theTable, 'tbody');
        for (var tb = 0; tb < tableBodies.length; tb++) {
            var nextTableBody = tableBodies[tb];

            // look for any rows in this body
            var rowsInBody = nextTableBody.select('tr');
            if (rowsInBody.length > 0) {
                theTableBody = nextTableBody;
            }
        }

        // if none of the tbodies had any rows, just pick the first tbody and use it
        if (theTableBody == null) {
            // alert("didn't find anything with content, so just using the first row");
            theTableBody = theTable.firstChild;
        }
    }
    else {
        theTableBody = theTable.firstChild;
    }

    return theTableBody;
}

//***************************************************************************
//
// Takes an a reference to a table object, loops through it, and colors the
// rows alternating colors (i.e. 'STRIPE-ING')
// This is to ensure that when a new row is added,
// both IE and FireFox will show it with the correct coloring
//
function stripeTable(tableElement) {
    var theTable = $(tableElement);

    // loop over all the rows, alternating their coloring
    var theTableBody = getUtilizedTableBodyFromTable(tableElement)
    var theTableRows = getImmediateDescendantsOfType(theTableBody, 'tr');

    var visibleCounter = 0;

    for (var r = 0; r < theTableRows.length; r++) {
        // get reference to the row
        var theRow = theTableRows[r];

        // if the row is invisible, don't count it when striping (so if an even row is between
        // two odd rows, but is invisible, we don't put two even rows together)
        if ($(theRow).hasClassName('invisible')) {
            continue;
        }
        else {

            // if the row already has row_even or row_odd, take it off
            if ($(theRow).hasClassName('row_even')) {
                $(theRow).removeClassName('row_even');
            }
            if ($(theRow).hasClassName('row_odd')) {
                $(theRow).removeClassName('row_odd');
            }

            // now apply the proper row style
            if (visibleCounter % 2 == 0) {
                $(theRow).addClassName('row_even');
            }
            else {
                $(theRow).addClassName('row_odd');
            }

            visibleCounter += 1;
        }
    }
}

//***************************************************************************
//
// This method will get all immediate descendants of a particular node
// that match the given tag type. For example, you might wish to find all
// 'table' elements within a 'div'...
//
function getImmediateDescendantsOfType(element, type) {
    var results = new Array();

    var immediateDescendants = element.childElements();
    for (var i = 0; i < immediateDescendants.length; i++) {
        var nextChild = immediateDescendants[i];

        var upperType = type.toUpperCase();
        var upperTagName = nextChild.tagName.toUpperCase();

        if (upperType == upperTagName) {
            results.push($(nextChild));
        }
    }

    // alert("found " + results.length + " elements of type '" + type + "' inside element " + element);

    return results;
}

/**
 * Determines the screenpage id (taking into account the legacy and spring pages)
 * Determines (through a back end call) the appropriate help file to include (role and locale aware)
 * Dynamically includes the help js (resource is tasked only if the user hits the help link)
 * Calls the help function (passing in context),from the dynamically included js, to launch the help system.
 * 
 * @param ref
 */
function showHelp(ref) {
    var screenPageIdValue = '';
    var screenPageNameValue = '';
    // try to get the primary elements that would have the page ids
    var screenPageId = $('page_screen_id');
    var screenPageName = $('page_screen_name');
    // if the primary elements are not found, look for the page ids in the secondary elements
    if (null == screenPageId) {
        screenPageId = $('page_screen_id_alt');
        screenPageName = $('page_screen_name_alt');
    }
    // extract the values from within the elements
    if (null != screenPageId && null != screenPageName) {
        screenPageIdValue = screenPageId.innerHTML;
        screenPageNameValue = screenPageName.innerHTML;
        try {
            jQuery.getJSON('/ajaxHandler', {request: "getHelpSystemPath"},
                function (helpSystemJson) {
                    jQuery.getScript(helpSystemJson.script, function () {
                        FMCOpenHelp(screenPageIdValue, null, null, null, helpSystemJson.path);
                    });
                });
        } catch (error) {
            alert('Unexpected error launching help ' + error);
        }
    } else {
        alert('no reference found for screenPageId');
    }

    // add the gathered values as a title to the help element, (to help debugging)
    $(ref).writeAttribute('title', screenPageNameValue + ':' + screenPageIdValue);
}

function goToMindTouch() {
    jQuery.getJSON('/ajaxHandler', {request: "getMindTouchImpersonationUrl"},
        function (mtJson) {
            if (mtJson.path) {
                var win = window.open(mtJson.path, 'mt');
                if (win) {
                    win.focus();
                } else {
                    alert('Please allow popups for Success Center access');
                }
            } else {
                alert('Unable to login to Success Center' + (mtJson.reason ? ': ' + mtJson.reason : '') + '.');
            }
        }
    );
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) { 
            return pair[1]; 
        }
    }
    return null; //not found 
}

function countCheckedItems() {
    var checkedCount = 0;
    $$('input[type=checkbox].selectAll').each(
        function(cb) {
            if (cb.checked) {
                checkedCount++;
            }
        }
    );
    return checkedCount;
}

function toggleDeleteUpdateCopyButtons() {
    if (countCheckedItems() > 0) {
        jQuery("input[value='delete'].acc-general-button").removeAttr("disabled");
        jQuery("input[value='update'].acc-general-button").removeAttr("disabled");
        jQuery("input[value='copy'].acc-general-button").removeAttr("disabled");
        jQuery("input[value='view'].acc-general-button").removeAttr("disabled");
    } else {
        jQuery("input[value='delete'].acc-general-button").attr("disabled", true);
        jQuery("input[value='update'].acc-general-button").attr("disabled", true);
        jQuery("input[value='copy'].acc-general-button").attr("disabled", true);
        jQuery("input[value='view'].acc-general-button").attr("disabled", true);
    }
}

function popupSimilarTransactionsForSuppliedValue(context, transId, detailId, vcId, bucketId, suppliedValue) {
    var requestString = context;
    requestString += '/jsp/agent/queue/similarTransactions.jsf';
    requestString += '?transId=' + transId;
    requestString += '&detailId=' + detailId;
    requestString += '&vcId=' + vcId;
    requestString += '&bucketId=' + bucketId;
    requestString += '&supplied=' + encodeURIComponent(suppliedValue);

    var windowId = "transId" + transId + "detailId" + detailId + "vcId" + vcId;

    window.open(requestString,windowId,'status=0,location=0,directories=0,menubar=0,toolbar=0,width=600,height=400,resizable=1,scrollbars=1');
}

function formatMessage(message, args) {
    for (var i = 0, len = args.length; i < len; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        message = message.replace(reg, args[i]);
    }
    return message;
}
/**
 * This method fires a custom event, notifying
 * listeners that an event has occurred that will maintain
 * the session.
 *
 * Any link/ajax event that fires should call this method, to
 * tell the IdleTimer that action has occurred that will
 * keep the session alive.
 *
 * @return
 */

var $j = jQuery;

function fireUserActiveEvent() {
    if (typeof(Event) === 'function') {
        // all browsers except IE
        document.dispatchEvent(new Event('state:active'));
    } else {
        // IE
        var event = document.createEvent('Event');
        event.initEvent('state:active', false, false);
        document.dispatchEvent(event);
    }
}

function logoutUser() {
    localStorage.setItem('userSession_lastRefreshedTime', 0);
    sessionStorage.setItem('userSession_exitMethod', 'logout');
    window.location='/unsecured/logouti.jsf';
}

/**
 * The IdleTimer class will listen for a custom event, called 'state:active',
 * which is to be fired by the page upon certain key actions.
 *
 * When the event is observed by this object, it will reset its countdown
 * timer.
 *
 * When the timer reaches a critical level (i.e. a couple of minutes
 * before anticipated session timeout), this object will alert the
 * user and give them an opportunity to keep their session alive,
 * through a heartbeat or ping to the server.
 *
 * Call it like this:
 *
 * new IdleTimer();
 *
 * or
 *
 * new IdleTimer({duration: 60000, warnAt: 10000});
 *
 */

function IdleTimer(options) {
    'use strict';

    // timer to track time before warning panel is displayed
    var _mainWarningTimer = null;
    // used to count down the time in the warning panel
    var _countdownTimer = null;
    // the number of seconds left for the countdown timer
    var _secondsRemaining = null;
    var isDialogOpen = false;
    var _orgPageTitle = '';

    this.options = $j.extend({
        // 15 minutes, by default, in milliseconds
        duration: 900000,
        // 2 minute warning
        warnAt: 120000,
        // text for this widget
        ABOUT_TO_EXPIRE_TEXT: 'Your session is about to expire.',
        ABOUT_TO_EXPIRE_TITLE: 'Session Timeout',
        COUNTDOWN_TEXT_1: 'You will be logged out in',
        COUNTDOWN_TEXT_2: 'seconds.',
        COUNTDOWN_TEXT_3: 'Do you want to stay logged in?',
        KEEP_LOGGED_IN_TEXT: 'Yes, Keep me logged in',
        LOG_ME_OUT_TEXT: 'No, Log me out'
    }, options || {} ); // this last line will override the
    // defaults with options passed in

    var timeBeforeWarning = this.options.duration - this.options.warnAt;

    this.beginTimer = function() {
        this.initObservers();
        this.initWarningTimer();
    };

    // begin listening for events
    this.initObservers = function() {
        // listen for the custom event
        document.addEventListener('state:active', this.initWarningTimer.bind(this));
    };

    this.initWarningTimer = function() {
        localStorage.setItem('userSession_lastRefreshedTime', (new Date()).getTime());
        this.startWarningTimer(timeBeforeWarning);
    };

    // restarts the timer
    this.startWarningTimer = function(counter) {
        clearTimeout(_countdownTimer);
        clearTimeout(_mainWarningTimer);

        // start the timer
        // when it runs out, call the showWarningPanel method
        _mainWarningTimer = setTimeout(
            function () {
                this.mainWarningTimerExpired();
            }.bind(this),
            counter);

        if (isDialogOpen) {
            AccDialog.close();
            isDialogOpen = false;
        }
    };

    // check the value of userSession_lastRefreshedTime in localStorage
    // null means timeout
    // 0 means the user chose to log out
    this.mainWarningTimerExpired = function () {
        var now = (new Date()).getTime();
        var lastRefreshedTimeStr = localStorage.getItem('userSession_lastRefreshedTime');
        if (lastRefreshedTimeStr && !isNaN(lastRefreshedTimeStr)) {
            var lastRefreshedTime = parseInt(lastRefreshedTimeStr, 10);
            var diff = now - lastRefreshedTime;
            if (this.isLogout(lastRefreshedTime)) {
                logoutUser();
            } else if (this.isIdle(diff)) {
                this.showWarningPanel();
            } else {
                var counter = timeBeforeWarning - diff;
                this.startWarningTimer(counter);
            }
        } else {
            this.timeout();
        }
    };

    this.isLogout = function (lastRefreshedTime) {
        return lastRefreshedTime === 0;
    };

    this.isIdle = function (diff) {
        return diff >= timeBeforeWarning;
    };

    // kicks off the countdown
    this.initCountdown = function() {
        clearTimeout(_countdownTimer);
        _secondsRemaining = this.options.warnAt / 1000;
        if ($j('#countdowntimer') !== null) {
            $j('#countdowntimer').html(_secondsRemaining);
        }
        this.startCountDownTimer();
    };

    // keeps the countdown running
    this.startCountDownTimer = function() {
        _countdownTimer = setTimeout(
            function() {
                if (document.title === _orgPageTitle) {
                    document.title = this.options.ABOUT_TO_EXPIRE_TITLE;
                } else {
                    document.title = _orgPageTitle;
                }
                this.countDownTimerExpired();
            }.bind(this),
            // go a little faster than once per second ;)
            900);
    };

    // check the value of userSession_lastRefreshedTime in localStorage
    // null means timeout
    // 0 means the user chose to log out
    this.countDownTimerExpired = function() {
        var now = (new Date()).getTime();
        var lastRefreshedTimeStr = localStorage.getItem('userSession_lastRefreshedTime');
        if (lastRefreshedTimeStr && !isNaN(lastRefreshedTimeStr)) {
            var lastRefreshedTime = parseInt(lastRefreshedTimeStr, 10);
            var diff = now - lastRefreshedTime;
            if (this.isLogout(lastRefreshedTime)) {
                logoutUser();
            } else if (this.isIdle(diff)) {
                this.decrementCounter(diff);
            } else {
                // timeout popup was dismissed in other tab
                document.title = _orgPageTitle;
                var counter = timeBeforeWarning - diff;
                this.startWarningTimer(counter);
            }
        } else {
            this.timeout();
        }
    };

    // counts down by one second, and updates the countdown timer display
    this.decrementCounter = function(diff) {
        _secondsRemaining = parseInt((this.options.duration - diff) / 1000, 10) ;
        if (_secondsRemaining >= 0) {
            this.startCountDownTimer();
            if ($j('#countdowntimer') !== null) {
                $j('#countdowntimer').html(_secondsRemaining);
            }
        } else {
            this.timeout();
        }
    };

    // invoked once the user is warned and clicks stay
    this.userAskedToExtendSession = function() {
        // stop countdown timer
        clearTimeout(_countdownTimer);
        document.title = _orgPageTitle;
        this.sessionPing();
    };

    // shows the dialog warning the user of impending timeout
    this.showWarningPanel = function() {
        _orgPageTitle = document.title;
        var container = jQuery('<div/>');
        var content = '\
            <div class="row">\
                <div class="col-md-2 acc_dialog_icon centered">\
                    <i class="fa fa-warning" aria-hidden="true"></i>\
                </div>\
                <div class="col-md-10">\
                    <div class="acc_dialog_title">\
                        ' + this.options.ABOUT_TO_EXPIRE_TEXT + '\
                    </div>\
                    <div class="acc_dialog_message">\
                        ' + this.options.COUNTDOWN_TEXT_1 + ' ' + '\
                        <span id="countdowntimer" class="bold">' + (this.options.warnAt / 1000) + '</span>\
                        ' + ' ' + this.options.COUNTDOWN_TEXT_2 + '\
                        <br>\
                        ' + ' ' + this.options.COUNTDOWN_TEXT_3 + '\
                    </div>\
                </div>\
            </div>\
            <div class="row">\
                <div class="btn-group col-md-1">\
                </div>\
                <div class="btn-group col-md-3 centered">\
                    <button type="button" class="btn btn-default acc-general-button" id="stayInButton" name="stayInButton" data-toggle="modal">' + this.options.KEEP_LOGGED_IN_TEXT + '</button>\
                </div>\
                <div class="btn-group col-md-3">\
                </div>\
                <div class="btn-group col-md-3 centered">\
                    <button type="button" class="btn btn-default acc-secondary-button" id="logOutButton" name="logOutButton" data-toggle="modal">' + this.options.LOG_ME_OUT_TEXT + '</button>\
                </div>\
                <div class="btn-group col-md-2">\
            </div>\
        ';
        container.append(content);

        AccDialog.open(container.html(),
            {
                width: 520,
                height: 240,
                zIndex: 20000,
                windowParameters: {className: 'acc_dialog'},
                maskOverlay: true
            }
        );
        isDialogOpen = true;

        $j('#stayInButton').on('click', function () {
            this.userAskedToExtendSession();
        }.bind(this));

        $j('#logOutButton').on('click', function () {
            logoutUser();
        }.bind(this));

        // show countdown
        this.initCountdown();
    };

    this.timeout = function () {
        localStorage.setItem('userSession_lastRefreshedTime', null);
        sessionStorage.setItem('userSession_exitMethod', 'timeout');
        window.location='/unsecured/logouti.jsf';
    };

    this.sessionPing = function() {
        $j.ajax({
            url: '/ajaxHandler',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: {request: 'ping'},
            success: function(jsonResponse) {
                if (jsonResponse.status !== null && jsonResponse.status === 'SUCCESS') {
                    this.initWarningTimer();
                } else {
                    this.timeout();
                }
            }.bind(this),
            error: function (jqXHR, textStatus, errorThrown) {
                this.timeout();
            }.bind(this)
        });
    };
}
(function () {
    (function() {
        if (!String.prototype.endsWith) {
            // for hint warning
            var proto = String.prototype;
            proto.endsWith = function(searchString, position) {
                var subjectString = this.toString();
                if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
                    position = subjectString.length;
                }
                position -= searchString.length;
                var lastIndex = subjectString.lastIndexOf(searchString, position);
                return lastIndex !== -1 && lastIndex === position;
            };
        }
    })();

    (function () {
        if (!String.prototype.startsWith) {
            var proto = String.prototype;
            proto.startsWith = function(searchString, position) {
                return this.substr(position || 0, searchString.length) === searchString;
            };
        }
    })();
})();
function AlertsPanel(options) {
    'use strict';

    this.options = $j.extend({
        baseUrl: '/ajaxHandler',        // this is the base url
        dialogClassName: 'acc_dialog',   // this is the style of the dialog box
        okButtonText: 'OK'             // this is the text for the 'OK' button
    }, options || {}); // this last line allows options to be passed in
                        // optionally, and will override any defaults with those
                        // passed in

    this.proceedWithPageLoad = function() {
        AccDialog.close();
    };

    // makes an ajax call to the server to see if there are any alerts that the user needs to see
    this.checkForUnseenAlerts = function(viewedAlertId) {
        $j.ajax({
            url: this.options.baseUrl,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: {
                request: 'getNextUnseenAlert',
                viewedAlertId: viewedAlertId
            },
            success: function(jsonResponse) {
                this.processCheckForAlertsResponse(jsonResponse);
            }.bind(this),
            error: function(jqXHR, textStatus, errorThrown) {
                this.checkForAlertsFailure(jqXHR, textStatus, errorThrown);
            }.bind(this)
        });
    };

    // this method is called when the ajax call to check for unseen alerts returns
    this.processCheckForAlertsResponse = function(jsonResponse) {
        if (!jsonResponse) {
            this.proceedWithPageLoad();
            return;
        }
    
        // determine if there are unseen alerts to display
        var unseenAlertCount = 0;
        try {
            unseenAlertCount = Number(jsonResponse.unseenAlertCount);
            if (unseenAlertCount == Number.NaN) {
                unseenAlertCount = 0;
            }
        } catch (ne) {
            alert("Number parse exception while checking for unseen alerts: " + ne.name + " message: " + ne.message);
            unseenAlertCount = 0;
        }

        if (unseenAlertCount === 0) {
            this.proceedWithPageLoad();
        } else {
            this.enterViewUnseenAlertsFlow(jsonResponse);
        }
    };

    // not much we can do here but tell them there was an issue and proceed
    this.checkForAlertsFailure = function(jqXHR, textStatus, errorThrown) {
        if (jqXHR.readyState === 4) {
            alert("There was an error checking for unseen alerts: \n  responseText=" + jqXHR.responseText + ",\n  textStatus=" + textStatus + ",\n  errorThrown=" + errorThrown);
            this.proceedWithPageLoad();
        } else {
            jqXHR.abort();
        }
    };

    this.enterViewUnseenAlertsFlow = function(jsonResponse) {
        // first, do the work to construct the html for the panel
        var viewAlertHtml = this.buildViewAlertPanel(jsonResponse);

        if (this.accWindow) {
            AccDialog.update(this.accWindow, viewAlertHtml);
        } else {
            // show the dialog
            this.accWindow = AccDialog.open(viewAlertHtml, {
                    width: 520,
                    height: 440,
                    windowParameters: { className: this.options.dialogClassName }
            });
        }

        // bind the ok button to the event that will cycle them through unseen events
        $j('#okButton').on('click', function () {
            this.acknowledgeAlert();
        }.bind(this));
    };

    // sends the information that the alert has been seen, and optionally gets the
    // next alert as well
    this.acknowledgeAlert = function() {
        // pass in the id of the one that was just viewed, and wait for the next one
        this.checkForUnseenAlerts($j('#alertId').val());
    };

    // constructs the view alert panel
    //
    // @param jsonResponse - is the response from the server that indicated there
    //                       some unseen alerts they need to view
    this.buildViewAlertPanel = function(jsonResponse) {
        var alertObj = JSON.parse(jsonResponse.nextUnseenAlert);

        var content = '\
            <form id="viewAlertForm">\
                <input type="hidden" id="alertId" value="' + alertObj.id + '">\
                <div class="row acc_dialog_title centered">\
                    ' + jsonResponse.title + '\
                </div>\
                <br>\
                <div class="row">\
                    <label class="col-md-4 control-label">' + alertObj.alertIdentifierLabel + '</label>\
                    <div class="col-md-8">\
                        ' + alertObj.alertIdentifier + '\
                    </div>\
                </div>\
                <div class="row">\
                    <label class="col-md-4 control-label">' + alertObj.beginDateLabel + '</label>\
                    <div class="col-md-8">\
                        ' + alertObj.beginDate + '\
                    </div>\
                </div>\
                <div class="row">\
                    <label class="col-md-4 control-label">' + alertObj.endDateLabel + '</label>\
                    <div class="col-md-8">\
                        ' + alertObj.endDate + '\
                    </div>\
                </div>\
                <div class="row">\
                    <label class="col-md-4 control-label">' + alertObj.alertTypeLabel + '</label>\
                    <div class="col-md-8">\
                        ' + alertObj.alertType + '\
                    </div>\
                </div>\
                <div class="row">\
                    <label class="col-md-4 control-label">' + alertObj.severityTypeLabel + '</label>\
                    <div class="col-md-8">\
                        ' + alertObj.severityType + '\
                    </div>\
                </div>\
                <div class="row">\
                    <label class="col-md-4 control-label">' + alertObj.alertDescriptionLabel + '</label>\
                    <div class="col-md-8">\
                        ' + alertObj.alertDescription + '\
                    </div>\
                </div>\
                <div class="row">\
                    <label class="col-md-4 control-label">' + alertObj.alertTextLabel + '</label>\
                    <div class="col-md-8" style="overflow-y: auto; max-height: 80px;">\
                        ' + alertObj.alertText + '\
                    </div>\
                </div>\
                <br><br>\
                <div class="row centered">\
                    <button type="button" class="btn btn-default acc-general-button" id="okButton" name="okButton" data-toggle="modal">' + this.options.okButtonText + '</button>\
                </div>\
            </form>\
        ';

        return content;
    }
}
// Copyright (c) 2006 Sébastien Gruhier (http://xilinus.com, http://itseb.com)
//
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//
// VERSION 1.3
//
// This is the re-write of window.js in jQuery

function AccWindow() {
    this.initialize.apply(this, arguments);
}

AccWindow.keepMultiModalWindow = false;
AccWindow.initZIndex = 10000;

AccWindow.prototype = {
    // Constructor
    // Available parameters : className, minWidth, minHeight, parent, url, onload, width, height, opacity, recenterAuto, closeCallback, destroyOnClose, gridX, gridY
    //                        add all callbacks (if you do not use an observer)
    //                        onDestroy onFocus onBlur onBeforeShow onShow onHide onClose

    initialize: function() {
        var id;
        var optionIndex = 0;
        // For backward compatibility like win= new Window("id", {...}) instead of win = new Window({id: "id", ...})
        if (arguments.length > 0) {
            if (typeof arguments[0] === 'string') {
                id = arguments[0];
                optionIndex = 1;
            }
            else {
                id = arguments[0] ? arguments[0].id : null;
            }
        }

        // Generate unique ID if not specified
        if (!id) {
            id = 'window_' + new Date().getTime();
        }

        if (document.getElementById(id)) {
            alert('Window ' + id + ' is already registered in the DOM! Make sure you use setDestroyOnClose() or destroyOnClose: true in the constructor');
        }

        this.options = jQuery.extend({
            className: 'acc_dialog',
            minWidth: 520,
            minHeight: 240,
            parent: document.body,
            url: null,
            onload: function () {},
            opacity: 1,
            recenterAuto: true,
            closeCallback: null,
            destroyOnClose: true,
            gridX: 1,
            gridY: 1
        }, arguments[optionIndex] || {});

        if (typeof this.options.top === 'undefined' && typeof this.options.bottom === 'undefined') {
            this.options.top = this._round(Math.random() * 500, this.options.gridY);
        }
        if (typeof this.options.left === 'undefined' && typeof this.options.right === 'undefined') {
            this.options.left = this._round(Math.random() * 500, this.options.gridX);
        }

        this.element = this._createWindow(id);

        // Bind event listener
        this.eventOnLoad = function (event) {
            event.data._getWindowBorderSize(event)
        };
        this.eventResize = function (event) {
            event.data._recenter(event)
        };

        this.content = jQuery('#' + this.element.id + '_content');

        jQuery(window).bind('load', this, this.eventOnLoad);
        jQuery(window).bind('resize', this, this.eventResize);
        jQuery(window).bind('scroll', this, this.eventResize);
        jQuery(this.options.parent).bind('scroll', this, this.eventResize);

        this.useLeft = null;
        this.useTop = null;
        if (typeof this.options.left !== 'undefined') {
            jQuery(this.element).css('left', parseFloat(this.options.left) + 'px');
            this.useLeft = true;
        } else {
            jQuery(this.element).css('right', parseFloat(this.options.right) + 'px');
            this.useLeft = false;
        }

        if (typeof this.options.top !== 'undefined') {
            jQuery(this.element).css('top', parseFloat(this.options.top) + 'px');
            this.useTop = true;
        } else {
            jQuery(this.element).css('bottom', parseFloat(this.options.bottom) + 'px');
            this.useTop = false;
        }

        this.setOpacity(this.options.opacity);
        if (this.options.zIndex) {
            this.setZIndex(this.options.zIndex);
        }
        this._getWindowBorderSize();
        this.width = this.options.width;
        this.height = this.options.height;
        this.visible = false;
        if (this.width && this.height) {
            this.setSize(this.options.width, this.options.height);
        }
        AccWindows.register(this);
    },

    // Destructor
    destroy: function() {
        this._notify('onDestroy');
        jQuery(window).unbind('load', this.eventOnLoad);
        jQuery(window).unbind('resize', this.eventResize);
        jQuery(window).unbind('scroll', this.eventResize);
        this.content.unbind('load', this.options.onload);

        if (this._oldParent) {
            var content = this.getContent();
            var originalContent = null;
            for (var i = 0, len = content.contents().length; i < len; i++) {
                originalContent = content.contents()[i];
                if (originalContent.nodeType === 1) {
                    break;
                }
                originalContent = null;
            }
            if (originalContent) {
                this._oldParent.append(originalContent);
            }
            this._oldParent = null;
        }

        if (this.options.url) {
            this.content.src = null;
        }

        if (this.iefix) {
            this.iefix.remove();
        }

        jQuery(this.element).remove();
        AccWindows.unregister(this);
    },

    // Gets window content
    getContent: function() {
        return this.content;
    },

    // Gets window ID
    getId: function() {
        return this.element.id;
    },

    // Detroys itself when closing
    setDestroyOnClose: function() {
        this.options.destroyOnClose = true;
    },

    _round: function(val, round) {
        return round === 1 ? val : Math.floor(val / round) * round;
    },

    // Creates HTML window code
    _createWindow: function(id) {
        var className = this.options.className;
        var win = document.createElement('div');
        win.setAttribute('id', id);
        win.className = 'acc_dialog';
        win.innerHTML = '<div id="' + id + '_content" class="' + className + '_content"> </div>';
        jQuery(win).hide();
        this.options.parent.insertBefore(win, this.options.parent.firstChild);
        jQuery('#' + id + '_content').load(function() {
            this.options.onload();
        }.bind(this));
        return win;
    },

    // Sets window location
    setLocation: function(top, left) {
        jQuery(this.element).css('top', top + 'px');
        jQuery(this.element).css('left', left + 'px');

        this.useLeft = true;
        this.useTop = true;
    },

    getLocation: function() {
        var location = {};
        if (this.useTop) {
            location = jQuery.extend({top: jQuery(this.element).css('top')}, location);
        } else {
            location = jQuery.extend({bottom: jQuery(this.element).css('bottom')}, location);
        }
        if (this.useLeft) {
            location = jQuery.extend({left: jQuery(this.element).css('left')}, location);
        } else {
            location = jQuery.extend({right: jQuery(this.element).css('right')}, location);
        }

        return location;
    },

    // Gets window size
    getSize: function() {
        return {width: this.width, height: this.height};
    },

    // Sets window size
    setSize: function(width, height) {
        width = parseFloat(width);
        height = parseFloat(height);

        // Check min and max size
        if (width < this.options.minWidth) {
            width = this.options.minWidth;
        }

        if (height < this.options.minHeight) {
            height = this.options.minHeight;
        }

        if (this.options.maxHeight && height > this.options.maxHeight) {
            height = this.options.maxHeight;
        }

        if (this.options.maxWidth && width > this.options.maxWidth) {
            width = this.options.maxWidth;
        }

        this.width = width;
        this.height = height;

        jQuery(this.element).css('width', width + 'px');
        jQuery(this.element).css('height', height  + 'px');
    },

    // Brings window to front
    toFront: function() {
        if (this.element.style.zIndex < AccWindows.maxZIndex) {
            this.setZIndex(AccWindows.maxZIndex + 1);
        }
        if (this.iefix) {
            this._fixIEOverlapping();
        }
    },

    computeBounds: function() {
        if (!this.width || !this.height) {
            var size = AccWindowUtilities._computeSize(this.content.innerHTML, this.content.id, this.width, this.height, 0, this.options.className);
            if (this.height) {
                this.width = size + 5;
            } else {
                this.height = size + 5;
            }
        }

        this.setSize(this.width, this.height);
        if (this.centered) {
            this._center(this.centerTop, this.centerLeft);
        }
    },

    // Displays window modal state or not
    show: function(modal, maskOverlay) {
        this.visible = true;
        if (modal) {
            // Hack for Safari !!
            if (typeof this.overlayOpacity === 'undefined') {
                var that = this;
                setTimeout(function() {that.show(modal, maskOverlay)}, 10);
                return;
            }
            this.overlayOpacity = maskOverlay ? 1.0 : this.overlayOpacity;
            AccWindows.addModalWindow(this, maskOverlay);

            this.modal = true;
            this.setZIndex(AccWindows.maxZIndex + 1);
            AccWindows.unsetOverflow(this);
        } else if (!this.element.style.zIndex) {
            this.setZIndex(AccWindows.maxZIndex + 1);
        }

        // To restore overflow if need be
        if (this.oldStyle) {
            this.getContent().css('overflow', this.oldStyle);
        }

        this.computeBounds();

        this._notify('onBeforeShow');
        jQuery(this.element).show();

        this._checkIEOverlapping();
        AccWindowUtilities.focusedWindow = this;
        this._notify('onShow');
    },

    // Displays window modal state or not at the center of the page
    showCenter: function(modal, top, left, maskOverlay) {
        this.centered = true;
        this.centerTop = top;
        this.centerLeft = left;

        this.show(modal, maskOverlay);
    },

    isVisible: function() {
        return this.visible;
    },

    _center: function(top, left) {
        var windowScroll = AccWindowUtilities.getWindowScroll(this.options.parent);
        var pageSize = AccWindowUtilities.getPageSize(this.options.parent);
        if (typeof top === 'undefined') {
            top = (pageSize.windowHeight - this.height)/2;
        }
        top += windowScroll.top;

        if (typeof left === 'undefined') {
            left = (pageSize.windowWidth - this.width)/2;
        }
        left += windowScroll.left;
        this.setLocation(top, left);
        this.toFront();
    },

    _recenter: function(event) {
        if (this.centered) {
            var pageSize = AccWindowUtilities.getPageSize(this.options.parent);
            var windowScroll = AccWindowUtilities.getWindowScroll(this.options.parent);

            // Check for this stupid IE that sends dumb events
            if (this.pageSize && this.pageSize.windowWidth === pageSize.windowWidth && this.pageSize.windowHeight === pageSize.windowHeight &&
                this.windowScroll.left === windowScroll.left && this.windowScroll.top === windowScroll.top) {
                return;
            }
            this.pageSize = pageSize;
            this.windowScroll = windowScroll;
            // set height of Overlay to take up whole page and show
            var overlayId = '#overlay_' + this.getId();
            if (jQuery(overlayId)) {
                jQuery(overlayId).css('height', (pageSize.pageHeight + 'px'));
            }

            if (this.options.recenterAuto) {
                this._center(this.centerTop, this.centerLeft);
            }
        }
    },

    // Hides window
    hide: function() {
        this.visible = false;
        if (this.modal) {
            AccWindows.removeModalWindow(this);
            AccWindows.resetOverflow();
        }
        // To avoid bug on scrolling bar
        this.oldStyle = this.getContent().css('overflow') || 'auto';
        this.getContent().css('overflow', 'hidden');

        jQuery(this.element).hide();

        if (this.iefix) {
            this.iefix.hide();
        }

        if (!this.doNotNotifyHide) {
            this._notify('onHide');
        }
    },

    close: function() {
        // Asks closeCallback if exists
        if (this.visible) {
            if (this.options.closeCallback && !this.options.closeCallback(this)) {
                return;
            }

            AccWindows.updateFocusedWindow();

            this.doNotNotifyHide = true;
            this.hide();
            this.doNotNotifyHide = false;

            if (this.options.destroyOnClose) {
                this.destroy();
            }
            this._notify('onClose');
        }
    },

    setOpacity: function(opacity) {
        jQuery(this.element).css('opacity', opacity);
    },

    setZIndex: function(zindex) {
        jQuery(this.element).css('z-index', zindex);
        AccWindows.updateZindex(zindex, this);
    },

    _checkIEOverlapping: function() {
        if (!this.iefix && (navigator.appVersion.indexOf('MSIE') > 0) && (navigator.userAgent.indexOf('Opera') < 0) && (jQuery(this.element).css('position') === 'absolute')) {
            jQuery('#' + this.element.id).after('<iframe id="' + this.element.id + '_iefix" '+ 'style="display:none;position:absolute;filter:progid:DXImageTransform.Microsoft.Alpha(opacity=0);" ' + 'src="javascript:false;" frameborder="0" scrolling="no"></iframe>');
            this.iefix = jQuery('#' + this.element.id +'_iefix');
        }
        if (this.iefix) {
            setTimeout(this._fixIEOverlapping.bind(this), 50);
        }
    },

    _fixIEOverlapping: function() {
        // NOTE - AMortland commented out this one line to deal with an IE7 issue
        // Position.clone(this.element, this.iefix);
        this.iefix.zIndex(this.element.style.zIndex - 1);
        this.iefix.show();
    },

    _getWindowBorderSize: function() {
        div = document.createElement('div');
        div.className = 'overlay_' + this.options.className;
        document.body.appendChild(div);

        var that = this;

        // Workaround for Safari!!
        setTimeout(function() {that.overlayOpacity = jQuery(div).css('opacity'); div.parentNode.removeChild(div);}, 10);
    },

    _notify: function(eventName) {
        if (this.options[eventName]) {
            this.options[eventName](this);
        } else {
            AccWindows.notify(eventName, this);
        }
    }
};

// Windows containers, register all page windows
var AccWindows = {
    windows: [],
    modalWindows: [],
    observers: [],
    focusedWindow: null,
    maxZIndex: AccWindow.initZIndex,
    
    addObserver: function(observer) {
        this.removeObserver(observer);
        this.observers.push(observer);
    },

    removeObserver: function(observer) {
        this.observers = this.observers.filter(function (item) { return item !== observer; });
    },

    // onDestroy onStartResize onStartMove onResize onMove onEndResize onEndMove onFocus onBlur onBeforeShow onShow onHide onMinimize onMaximize onClose
    notify: function(eventName, win) {
        jQuery.each(this.observers, function(index, observer) {
            if (observer[eventName]) {
                observer[eventName](eventName, win);
            }
        })
    },

    // Gets window from its id
    getWindow: function(id) {
        return jQuery.grep(this.windows, function(w, index) { return w.getId() === id })[0];
    },

    // Gets the last focused window
    getFocusedWindow: function() {
        return this.focusedWindow;
    },

    updateFocusedWindow: function() {
        this.focusedWindow = this.windows.length >=2 ? this.windows[this.windows.length-2] : null;
    },

    // Add a modal window in the stack
    addModalWindow: function(win, maskOverlay) {
        AccWindowUtilities.disableScreen(
            win.options.className,
            'overlay_' + win.getId(),
            win.overlayOpacity,
            win.getId(),
            win.options.parent,
            maskOverlay);
        if (this.modalWindows.length > 0) {
            if (AccWindow.keepMultiModalWindow) {
                AccWindowUtilities._hideSelect(this.modalWindows[this.modalWindows.length - 1].getId());
            } else {
                jQuery(this.modalWindows[this.modalWindows.length - 1].element).hide();
            }
            AccWindowUtilities._showSelect(win.getId());
        }
        this.modalWindows.push(win);
    },

    removeModalWindow: function(win) {
        this.modalWindows.pop();

        // No more modal windows
        if (this.modalWindows.length === 0) {
            AccWindowUtilities.enableScreen(win);
        } else {
            if (AccWindow.keepMultiModalWindow) {
                this.modalWindows[this.modalWindows.length - 1].toFront();
                AccWindowUtilities._showSelect(this.modalWindows.last().getId());
            } else {
                jQuery(this.modalWindows[this.modalWindows.length - 1].element).show();
            }

            var objOverlay = document.getElementById('overlay_' + win.getId());
            if (objOverlay) {
                objOverlay.parentNode.removeChild(objOverlay);
            }
        }
    },

    // Registers a new window (called by Windows constructor)
    register: function(win) {
        this.windows.push(win);
    },

    // Unregisters a window (called by Windows destructor)
    unregister: function(win) {
        this.windows = this.windows.filter(function (item) { return item !== win; });
        if (this.windows.length === 0) {
            this.maxZIndex = AccWindow.initZIndex;
        }
    },

    // Closes all windows
    closeAll: function() {
        jQuery.each(this.windows, function(index, win) {
            AccWindows.close(win.getId());
        });
    },

    // Closes a window with its id
    close: function(id) {
        var win = this.getWindow(id);
        if (win) {
            win.close();
        }
    },

    blur: function(id) {
        var win = this.getWindow(id);
        if (!win) {
            return;
        }
        if (this.focusedWindow === win) {
            this.focusedWindow = null;
        }
        win._notify('onBlur');
    },

    focus: function(id) {
        var win = this.getWindow(id);
        if (!win) {
            return;
        }
        if (this.focusedWindow) {
            this.blur(this.focusedWindow.getId());
        }
        this.focusedWindow = win;
        win._notify('onFocus');
    },

    unsetOverflow: function(except) {
        jQuery.each(this.windows, function(index, win) {
            win.oldOverflow = win.getContent().css('overflow') || 'auto';
            win.getContent().css('overflow', 'hidden');
        });
        if (except && except.oldOverflow) {
            except.getContent().css('overflow', except.oldOverflow);
        }
    },

    resetOverflow: function() {
        jQuery.each(this.windows, function(index, win) {
            if (win.oldOverflow) {
                win.getContent().css('overflow', win.oldOverflow);
            }
        });
    },

    updateZindex: function(zindex, win) {
        if (zindex > this.maxZIndex) {
            this.maxZIndex = zindex;
            if (this.focusedWindow) {
                this.blur(this.focusedWindow.getId());
            }
        }
        this.focusedWindow = win;
        if (this.focusedWindow) {
            this.focus(this.focusedWindow.getId());
        }
    }
};

var AccDialog = {
    dialogIds: [],
    onCompleteFunc: null,
    callFunc: null,
    parameters: null,

    open: function(content, parameters) {
        content = content || "";

        // Backward compatibility
        parameters = parameters || {};
        parameters = jQuery.extend(parameters, parameters.windowParameters || {});
        parameters.windowParameters = parameters.windowParameters || {};

        parameters.className = parameters.className || 'alert';

        var html = '<div class="new-style-wrapper">' + content  + '</div>';

        parameters.ok = null;
        parameters.cancel = null;

        return this._openDialog(html, parameters)
    },

    close: function() {
        AccWindows.close(this.dialogIds.pop());
    },

    update: function(win, content) {
        var html = '<div class="new-style-wrapper">' + content  + '</div>';
        win.getContent().html(html);
    },

    _openDialog: function(content, parameters) {
        var className = parameters.className;

        if (!parameters.height && !parameters.width) {
            parameters.width = AccWindowUtilities.getPageSize((parameters.options && parameters.options.parent) ? parameters.options.parent : document.body).pageWidth / 2;
        }
        var d = null;
        if (parameters.id) {
            d = parameters.id;
        } else {
            var t = new Date();
            d = 'modal_dialog_' + t.getTime();
            parameters.id = d;
        }
        this.dialogIds.push(d);

        // compute height or width if need be
        if (!parameters.height || !parameters.width) {
            var size = AccWindowUtilities._computeSize(content, d, parameters.width, parameters.height, 5, className);
            if (parameters.height) {
                parameters.width = size + 5;
            } else {
                parameters.height = size + 5;
            }
        }

        parameters.maskOverlay = parameters.maskOverlay || false;

        var win = new AccWindow(parameters);
        win.getContent().html(content);

        win.showCenter(true, parameters.top, parameters.left, parameters.maskOverlay);
        win.setDestroyOnClose();

        win.cancelCallback = parameters.onCancel || parameters.cancel;
        win.okCallback = parameters.onOk || parameters.ok;

        return win;
    },

    okCallback: function() {
        var win = AccWindows.focusedWindow;
        if (!win.okCallback || win.okCallback(win)) {
            // Remove onclick on button
            $j('#' + win.getId() + ' input').each(function(index, element) {
                element.onclick=null;
            });
            win.close();
        }
    },

    cancelCallback: function() {
        var win = AccWindows.focusedWindow;
        // Remove onclick on button
        $j('#' + win.getId() + ' input').each(function(index, element) {
            element.onclick=null
        });
        win.close();
        if (win.cancelCallback) {
            win.cancelCallback(win);
        }
    }
};
/*
 Based on Lightbox JS: Fullsize Image Overlays
 by Lokesh Dhakar - http://www.huddletogether.com

 For more information on this script, visit:
 http://huddletogether.com/projects/lightbox/

 Licensed under the Creative Commons Attribution 2.5 License - http://creativecommons.org/licenses/by/2.5/
 (basically, do anything you want, just leave my name and link)
 */

if (jQuery.browser.webkit) {
    var array = navigator.userAgent.match(new RegExp(/AppleWebKit\/([\d\.\+]*)/));
    jQuery.browser.version = parseFloat(array[1]);
}

var AccWindowUtilities = {
    // From dragdrop.js
    getWindowScroll: function(parent) {
        var T, L, W, H;
        parent = parent || document.body;
        if (parent !== document.body) {
            T = parent.scrollTop;
            L = parent.scrollLeft;
            W = parent.scrollWidth;
            H = parent.scrollHeight;
        }
        else {
            var w = window;
            with (w.document) {
                if (w.document.documentElement && documentElement.scrollTop) {
                    T = documentElement.scrollTop;
                    L = documentElement.scrollLeft;
                } else if (w.document.body) {
                    T = body.scrollTop;
                    L = body.scrollLeft;
                }
                if (w.innerWidth) {
                    W = w.innerWidth;
                    H = w.innerHeight;
                } else if (w.document.documentElement && documentElement.clientWidth) {
                    W = documentElement.clientWidth;
                    H = documentElement.clientHeight;
                } else {
                    W = body.offsetWidth;
                    H = body.offsetHeight
                }
            }
        }
        return { top: T, left: L, width: W, height: H };
    },
    //
    // getPageSize()
    // Returns array with page width, height and window width, height
    // Core code from - quirksmode.org
    // Edit for Firefox by pHaez
    //
    getPageSize: function(parent){
        parent = parent || document.body;
        var windowWidth, windowHeight;
        var pageHeight, pageWidth;
        if (parent !== document.body) {
            windowWidth = parent.getWidth();
            windowHeight = parent.getHeight();
            pageWidth = parent.scrollWidth;
            pageHeight = parent.scrollHeight;
        }
        else {
            var xScroll, yScroll;

            if (window.innerHeight && window.scrollMaxY) {
                xScroll = document.body.scrollWidth;
                yScroll = window.innerHeight + window.scrollMaxY;
            } else if (document.body.scrollHeight > document.body.offsetHeight) { // all but Explorer Mac
                xScroll = document.body.scrollWidth;
                yScroll = document.body.scrollHeight;
            } else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
                xScroll = document.body.offsetWidth;
                yScroll = document.body.offsetHeight;
            }


            if (self.innerHeight) {  // all except Explorer
                windowWidth = self.innerWidth;
                windowHeight = self.innerHeight;
            } else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
                windowWidth = document.documentElement.clientWidth;
                windowHeight = document.documentElement.clientHeight;
            } else if (document.body) { // other Explorers
                windowWidth = document.body.clientWidth;
                windowHeight = document.body.clientHeight;
            }

            // for small pages with total height less then height of the viewport
            if (yScroll < windowHeight) {
                pageHeight = windowHeight;
            } else {
                pageHeight = yScroll;
            }

            // for small pages with total width less then width of the viewport
            if (xScroll < windowWidth) {
                pageWidth = windowWidth;
            } else {
                pageWidth = xScroll;
            }
        }
        return {pageWidth: pageWidth ,pageHeight: pageHeight , windowWidth: windowWidth, windowHeight: windowHeight};
    },

    disableScreen: function(className, overlayId, overlayOpacity, contentId, parent, maskOverlay) {
        AccWindowUtilities.initLightbox(
            overlayId,
            className,
            function() {this._disableScreen(className, overlayId, overlayOpacity, contentId)}.bind(this),
            parent || document.body,
            maskOverlay);
    },

    _disableScreen: function(className, overlayId, overlayOpacity, contentId) {
        // prep objects
        var objOverlay = document.getElementById(overlayId);

        var pageSize = AccWindowUtilities.getPageSize(objOverlay.parentNode);

        // Hide select boxes as they will 'peek' through the image in IE, store old value
        if (contentId && jQuery.browser.msie) {
            AccWindowUtilities._hideSelect();
            AccWindowUtilities._showSelect(contentId);
        }

        // set height of Overlay to take up whole page and show
        objOverlay.style.height = (pageSize.pageHeight + 'px');
        objOverlay.style.display = 'block';
    },

    enableScreen: function(win) {
        var id = 'overlay_' + win.getId();
        var objOverlay =  document.getElementById(id);
        if (objOverlay) {
            // hide lightbox and overlay
            objOverlay.style.display = 'none';
            objOverlay.parentNode.removeChild(objOverlay);

            // make select boxes visible using old value
            if (id !== '__invisible__') {
                AccWindowUtilities._showSelect();
            }
        }
    },

    _hideSelect: function(id) {
        if (jQuery.browser.msie) {
            id = id === null ? '' : '#' + id + ' ';
            jQuery(id + 'select').each(function(element) {
                if (!AccWindowUtilities.isDefined(element.oldVisibility)) {
                    element.oldVisibility = element.style.visibility ? element.style.visibility : 'visible';
                    element.style.visibility = 'hidden';
                }
            });
        }
    },

    _showSelect: function(id) {
        if (jQuery.browser.msie) {
            id = id === null ? '' : '#' + id + ' ';
            jQuery(id + 'select').each(function(element) {
                if (AccWindowUtilities.isDefined(element.oldVisibility)) {
                    // Why?? Ask IE
                    try {
                        element.style.visibility = element.oldVisibility;
                    } catch(e) {
                        element.style.visibility = 'visible';
                    }
                    element.oldVisibility = null;
                }
                else {
                    if (element.style.visibility) {
                        element.style.visibility = 'visible';
                    }
                }
            });
        }
    },

    isDefined: function(object) {
        return typeof(object) !== 'undefined' && object !== null;
    },

    // initLightbox()
    // Function runs on window load, going through link tags looking for rel="lightbox".
    // These links receive onclick events that enable the lightbox display for their targets.
    // The function also inserts html markup at the top of the page which will be used as a
    // container for the overlay pattern and the inline image.
    initLightbox: function(id, className, doneHandler, parent, maskOverlay) {
        // create overlay div and hardcode some functional styles (aesthetic styles are in CSS file)
        var objOverlay = document.createElement('div');
        objOverlay.setAttribute('id', id);
        objOverlay.className = (maskOverlay ? 'maskoverlay_' : 'overlay_') + className;
        objOverlay.style.display = 'none';
        objOverlay.style.position = 'absolute';
        objOverlay.style.top = '0';
        objOverlay.style.left = '0';
        objOverlay.style.zIndex = AccWindows.maxZIndex + 1;
        AccWindows.maxZIndex++;
        objOverlay.style.width = '100%';
        parent.insertBefore(objOverlay, parent.firstChild);
        if (jQuery.browser.webkit) {
            setTimeout(function() {doneHandler()}, 10);
        }
        else {
            doneHandler();
        }
    },

    _computeSize: function(content, id, width, height, margin, className) {
        var objBody = document.body;
        var tmpObj = document.createElement('div');
        tmpObj.setAttribute('id', id);
        tmpObj.className = className + '_content';

        if (height) {
            tmpObj.style.height = height + 'px';
        } else {
            tmpObj.style.width = width + 'px';
        }

        tmpObj.style.position = 'absolute';
        tmpObj.style.top = '0';
        tmpObj.style.left = '0';
        tmpObj.style.display = 'none';

        tmpObj.innerHTML = content;
        objBody.insertBefore(tmpObj, objBody.firstChild);

        var size;
        if (height) {
            size = jQuery(tmpObj).width() + margin;
        } else {
            size = jQuery(tmpObj).height() + margin;
        }
        objBody.removeChild(tmpObj);
        return size;
    }
};

