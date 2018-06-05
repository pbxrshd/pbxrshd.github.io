

  var UI = (function() {
    // vars holding global state
    var VIEW = "";
    var ACTIVE_LOG_CONTROL= null;
    var ACTIVE_SCHEDULE_WEEK = null;
    // things to perform when entering a view for the first time
    function init(view) {
      VIEW = view;
      switch (VIEW) {
        case "Raptors":
          var listHtml = "";
          (Object.keys(DATA.RAPTORS)).forEach(function(e) {
          listHtml += raptorListHtml(e);
          });
          html("#raptors-list", listHtml);
        break;
        case "Schedule":
          setupScheduleView();
        break;
        case "Reports":
          setupReportView();
        break;
        case "raptor_detail":
          if (location.hash.length > 1) {
            setupRaptorDetail(location.hash.substring(1));
          }
        break;
        default:
          //console.log("unknown view");
        break;
      }
    }
    // all events (click, swipe, etc.) are routed through here
    function event(id, params) {
      switch (id) {
        case "main_menu_icon":
          showHide("#main_menu");
        break;
        case "main_menu_item":
          mainMenuItemClicked(params);
        break;
        case "raptor_detail":
          go("raptor-detail.html" + "#" + params);
        break;
        case "log_control":
          logControlClicked(params);
        break;
        case "log_modal_header":
          logModalHeaderClicked(params);
        break;
        case "log_item":
          logItemClicked(params);
        break;
        case "schedule_view_change":
          setupScheduleView(params);
        break;
        case "report_view_change":
          setupReportView(params);
        break;
        default:
          console.log("unknown id event: " + id);
        break;
      }
    }
    //
    function raptorListHtml(id) {
      var html = "";
      html += "<div class=\"card";
      if ("Today" !== DATA.LOG[id].date) {
        html += " not-done";
      }
      html += "\" onclick=\"UI.event('raptor_detail','" + id + "')\">";
      html += "<div class=\"pic\"><img src=\"res/img/raptors/" + id + ".jpg\" class=\"pic\" /></div>";
      html += "<div class=\"l1\">" + DATA.RAPTORS[id].name + "<span class=\"text-icon text-icon-active\">&gt;</span></div>";
      html += "<div class=\"l2\">Last Entry:</div>";
      html += "<div class=\"l3\">";
      html += ("Today" === DATA.LOG[id].date) ? TEMPORAL.longFormat(TEMPORAL.today()) : TEMPORAL.longFormat(TEMPORAL.yesterday());
      html += "</div>";
      html += "</div>";
      return html;
    }
    //
    function setupRaptorDetail(id) {
      id = location.hash.substring(1);
      var raptorData = DATA.RAPTORS[id];
      html("#main_header .header-center", id);
      text("div.body-header div.title", raptorData.name);
      document.querySelector("div.body-header img.pic").src = raptorData.pic;
      var temperatures = SERVICE.getTemperatures();
      html("div.body-header div.temp", temperatures.high + " - " + temperatures.low + "&deg;F");
      var logData = DATA.LOG[id];
      var lastEntry = ("Today" === DATA.LOG[id].date) ? TEMPORAL.longFormat(TEMPORAL.today()) : TEMPORAL.longFormat(TEMPORAL.yesterday());
      text("div.body-header div.date", lastEntry);
      //
      var logSectionsHtml = "";
      DATA.LOG_ATTRS.forEach(function(attr) {
        logSectionsHtml += getLogSectionHtml(attr);
      });
      html("#log_sections", logSectionsHtml);
      //
      DATA.LOG_ATTRS.forEach(function(attr) {
        text("#" + attr + " div.control", logData[attr]);
      });
    }
    //
    function logControlClicked(params) {
      ACTIVE_LOG_CONTROL = params;// save current control id
      hide("#main_header");
      show("#modal_header");
      text("#log_control_modal .modal-header-title", ACTIVE_LOG_CONTROL);
      text("#log_control_modal .header-sub", DATA.LOG_CONTROLS[ACTIVE_LOG_CONTROL].hint);
      html("#log_control_modal ul", getLogControlHtml(ACTIVE_LOG_CONTROL));
      show("#log_control_modal");
      var checkedItem = document.querySelector("li.item-check");
      if (checkedItem) {
        checkedItem.scrollIntoView();
      }
    }
    //
    function logModalHeaderClicked(params) {
      if (params === "save") {
        var selectedItems = getElementsForSelector("#log_control_modal li.item-check");
        selectedItems = selectedItems.map(function(e){return text(e);});
        text("#" + ACTIVE_LOG_CONTROL + " div.control", selectedItems.join(","));
      } else {

      }
      hide("#modal_header");
      show("#main_header");
      hide("#log_control_modal");
      ACTIVE_LOG_CONTROL = null;// clear current control id
    }
    //
    function logItemClicked(params) {
      var targetRef = params.target;
      if (containsClass(targetRef, "item")) {
        var targetWasChecked = containsClass(targetRef, "item-check");
        getElementsForSelector("#log_control_modal li.item-check").forEach(function(e){removeClass(e,"item-check")});
        if (!targetWasChecked) {
          addClass(targetRef, "item-check");
        }
      }
    }
    //
    function getLogSectionHtml(id) {
      var html = "";
      html += "<div id=\"" + id + "\" class=\"section\">";
      html += "<div class=\"label\">" + id + "</div>";
      html += "<div class=\"control-col\">";
      html += "<div class=\"control\" onclick=\"UI.event('log_control','" + id + "')\"></div>";
      html += "</div></div>";
      return html;
    }
    //
    function getLogControlHtml(id) {
      var html = "";
      var data = DATA.LOG_CONTROLS[id];
      var selectedValues = text("#" + id + " div.control").split(",");
      if (id === "casts" ||
          id === "weight" ||
          id === "rodent" ||
          id === "quail" ||
          id === "remains") {
        var value = data.min;
        while (value <= data.max) {
          html += getItem(value, selectedValues);
          value++;
        }
      }
      if (id === "feces" ||
          id === "urates" ||
          id === "attitude" ||
          id === "cleaning" ||
          id === "water" ||
          id === "exercise" ||
          id === "weather") {
        var values = data.values;
        values.forEach(function(value) {
          html += getItem(value, selectedValues);
        });

      }
      return html;
      //
      function getItem(value, selectedValues) {
        value = "" + value;
        var itemHtml = "<li class=\"item";
        if (selectedValues && (selectedValues.indexOf(value) > -1)) {
          itemHtml += " item-check";
        }
        itemHtml += "\">" + value + "</li>";
        return itemHtml;
      }
    }
    //
    function setupScheduleView(offset) {
      if (typeof offset === "undefined" || offset === 0) {
        // first time into view, setup swipe
        ACTIVE_SCHEDULE_WEEK = TEMPORAL.thisWeek();
        /*
        var onSwipeCallback = function(evt, dir, phase, swipetype, distance) {
          if (swipetype === "left") {
            UI.event("schedule_view_change", -1);
          } else if (swipetype === "right") {
            UI.event("schedule_view_change", +1);
          }
        };
        SWIPER.init("#body_section", onSwipeCallback);
        */
      }
      //
      var maxDateRep = DATA.SCHEDULE.maxDate;
      if (offset < 0) {
        if (TEMPORAL.weekContains(ACTIVE_SCHEDULE_WEEK, maxDateRep) > -1) {
          toast("No more entries");
          return;
        }
        ACTIVE_SCHEDULE_WEEK = TEMPORAL.nextWeek(ACTIVE_SCHEDULE_WEEK[0]);
      } else if (offset > 0) {
        if (TEMPORAL.weekContains(ACTIVE_SCHEDULE_WEEK) > -1) {
          toast("No previous entries");
          return;
        }
        ACTIVE_SCHEDULE_WEEK = TEMPORAL.prevWeek(ACTIVE_SCHEDULE_WEEK[0]);
      }
      //
      var todayRep = TEMPORAL.format(TEMPORAL.today());
      var subHeader = TEMPORAL.shortFormat(ACTIVE_SCHEDULE_WEEK[0]) + " to " + TEMPORAL.shortFormat(ACTIVE_SCHEDULE_WEEK[6]);
      text("#schedule div.sub-center", subHeader);
      if (TEMPORAL.weekContains(ACTIVE_SCHEDULE_WEEK,todayRep) > -1) {
        addClass("#schedule div.sub-center", "sub-center-active");
        removeClass("#schedule div.sub-left", "text-icon-active");
        addClass("#schedule div.sub-left", "text-icon-inactive");
      } else {
        removeClass("#schedule div.sub-center", "sub-center-active");
        removeClass("#schedule div.sub-left", "text-icon-inactive");
        addClass("#schedule div.sub-left", "text-icon-active");
      }
      if (TEMPORAL.weekContains(ACTIVE_SCHEDULE_WEEK, maxDateRep) > -1) {
        removeClass("#schedule div.sub-right", "text-icon-active");
        addClass("#schedule div.sub-right", "text-icon-inactive");
      } else {
        removeClass("#schedule div.sub-right", "text-icon-inactive");
        addClass("#schedule div.sub-right", "text-icon-active");
      }
      ACTIVE_SCHEDULE_WEEK.forEach(function(e,i) {
        text("#entry_" + i + " div.entry-date", TEMPORAL.shortFormat(e));
        html("#entry_" + i + " div.entry-rhs", getSheduledHtml(SERVICE.getScheduled()));
        if (e === todayRep) {
          addClass("#entry_" + i + " div.entry-lhs", "current");
        } else {
          removeClass("#entry_" + i + " div.entry-lhs", "current");
        }
      });
      //
      document.querySelector("#body_top").scrollIntoView();
    }
    //
    function getSheduledHtml(scheduledArray) {
      var html = "";
      scheduledArray.forEach(function(e) {
        html += "<div class=\"entry-person\">";
        html += "<img class=\"schedule-entry-pic\" src=\"" + DATA["PEOPLE"][e]["pic"] + "\" />";
        html += "<div class=\"schedule-entry-name\">" + DATA["PEOPLE"][e]["name"] + "</div>";
        html += "</div>";
      });
      return html;
    }
    //
    function setupReportView(offset) {
      var activeSectionRef = document.querySelector(".chart-section.show");
      if (typeof offset === "undefined" || offset === 0) {
        // first time into view, setup swipe
        /*
        var onSwipeCallback = function(evt, dir, phase, swipetype, distance) {
          if (swipetype === "left") {
            UI.event("report_view_change", -1);
          } else if (swipetype === "right") {
            UI.event("report_view_change", +1);
          }
        };
        SWIPER.init("#body_section", onSwipeCallback);
        */
      } else {
        // on activeSectionRef, add "hide", remove "show"
        addClass(activeSectionRef, "hide");
        removeClass(activeSectionRef, "show");
        // get currentActiveSectionId
        var currentId = activeSectionRef.getAttribute("id");
        currentId = parseInt(currentId.substring(currentId.indexOf("_")+1));
        // calculate new activeSectionId
        var newActiveSectionId = (3 + currentId + offset) % 3;
        // set it as activeSectionRef
        activeSectionRef = document.querySelector("#section_" + newActiveSectionId);
        // on activeSectionRef, remove "hide" add "show"
        removeClass(activeSectionRef, "hide");
        addClass(activeSectionRef, "show");
      }
      text("#reports div.sub-center", activeSectionRef.getAttribute("data-title"));
      //document.querySelector("#body_top").scrollIntoView();
    }
    //
    function mainMenuItemClicked(params) {
      var targetRef = params.target;
      if (containsClass(targetRef, "main-menu-item")) {
        switch (text(targetRef)) {
          case "Raptors":
            go("raptors.html");
          break;
          case "Schedule":
            go("schedule.html");
          break;
          case "Reports":
            go("reports.html");
          break;
          case "Settings":
            go("settings.html");
          break;
          case "Help":
            go("help.html");
          break;
          default:
          break;
        }
      }
    }
    //
    function toast(message) {
      alert(message);
    }

    return {
      init : init,
      event : event,
      toast : toast
    }
  })(); // UI

  var TEMPORAL = (function() {
    // "dateRep" is ISO 8601 Complete date: YYYY-MM-DD (eg 1997-07-16)
    var WEEKDAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    var MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    //
    function pad(number) {
      return (number < 10) ? "0" + number: number;
    }
    //
    function toDate(dateOrDateRep) {
      if (typeof dateOrDateRep === "undefined") {
        return getToday();
      }
      if (typeof dateOrDateRep === "string") {
        var date = new Date();
        var dateParts = dateOrDateRep.split("-");
        date.setFullYear(parseInt(dateParts[0]));
        date.setMonth(parseInt(dateParts[1]) - 1);
        date.setDate(parseInt(dateParts[2]));
        return date;
      }
      return dateOrDateRep;
    }
    //
    function getDateOffsetted(dateOrDateRep, daysToOffset) {
      var date = toDate(dateOrDateRep);
      if (daysToOffset !== 0) {
        date.setDate(date.getDate() + daysToOffset);
      }
      return date;
    }
    // formats dateOrDateRep as ISO 8601 Complete date: YYYY-MM-DD (eg. "1997-07-16")
    function format(dateOrDateRep) {
      var date = toDate(dateOrDateRep);
      return date.getUTCFullYear() +"-"+ pad(date.getUTCMonth() + 1) +"-"+ pad(date.getUTCDate());
    }
    // Tuesday 25 Oct
    function longFormat(dateOrDateRep) {
      var date = toDate(dateOrDateRep);
      return WEEKDAYS[date.getDay()] +" "+ date.getDate() +" "+ MONTHS[date.getMonth()];
    }
    // Oct 25
    function shortFormat(dateOrDateRep) {
      var date = toDate(dateOrDateRep);
      return MONTHS[date.getMonth()] +" "+ date.getDate();
    }
    //
    function getToday() {
      return new Date();
    }
    //
    function getYesterday(dateOrDateRep) {
      var date = toDate(dateOrDateRep);
      return getDateOffsetted(date, -1);
    }
    //
    function getTomorrow(dateOrDateRep) {
      var date = toDate(dateOrDateRep);
      return getDateOffsetted(date, 1);
    }
    //
    function getWeek(dateOrDateRep) {
      var date = toDate(dateOrDateRep);
      var week = [];
      var dayIndex = date.getDay();
      var offsetToMondayOfWeek = (dayIndex > 0) ? (1 - dayIndex) : -6;
      var refDate = getDateOffsetted(date, offsetToMondayOfWeek);
      [0,1,2,3,4,5,6].forEach(function(e) {
        week.push(format(refDate));
        refDate = getDateOffsetted(refDate, 1);
      });
      return week;
    }
    //
    function getNextWeek(dateOrDateRep) {
      return getWeek(getDateOffsetted(dateOrDateRep, 7));
    }
    //
    function getPrevWeek(dateOrDateRep) {
      return getWeek(getDateOffsetted(dateOrDateRep, -7));
    }
    // if week contains dateOrDateRep, returns it's index in the week array
    // return -1 if week does not contain dateOrDateRep
    function weekContains(week, dateOrDateRep) {
      if (typeof dateOrDateRep === "undefined") {
        dateOrDateRep = getToday();
      }
      return week.indexOf(format(dateOrDateRep));
    }
    //
    return {
      format : format,
      longFormat : longFormat,
      shortFormat : shortFormat,
      today : getToday,
      yesterday : getYesterday,
      tomorrow : getTomorrow,
      thisWeek : getWeek,
      nextWeek : getNextWeek,
      prevWeek : getPrevWeek,
      toDate : toDate,
      weekContains : weekContains
    }
  })(); // TEMPORAL

  var SWIPER = (function() {
    /**
    sample usage:
    ontouch(touchsurface, // reference to the touchSurface
            callback // function(evt, // contains original Event object
                                dir, // contains "none", "left", "right", "top", or "down"
                                phase, // contains "start", "move", or "end"
                                swipetype, // contains "none", "left", "right", "top", or "down"
                                distance // distance traveled either horizontally or vertically, depending on dir value
                                )
    sample callback:
    function() {
      if (phase === 'move' && (dir ==='left' || dir === 'right')) {
        console.log('finger moved horizontally by ' + distance);
      }
    }


    // run this onload of the page
    function init() {
      var callback = function(evt, dir, phase, swipetype, distance) {
            var touchreport = '';
            touchreport += '<b>Dir:</b> ' + dir + '<br />';
            touchreport += '<b>Phase:</b> ' + phase + '<br />';
            touchreport += '<b>Swipe Type:</b> ' + swipetype + '<br />';
            touchreport += '<b>Distance:</b> ' + distance + '<br />';
            document.querySelector("#touch_surface").innerHTML = touchreport;
          };
      SWIPER.init("div.body-section", callback);
    }

    */
    function ontouch(touchsurface, callback) {
      var	dir;
      var	swipeType;
      var	startX;
      var	startY;
      var	distX;
      var	distY;
      var	threshold = 150; //required min distance traveled to be considered swipe
      var	restraint = 100; // maximum distance allowed at the same time in perpendicular direction
      var	allowedTime = 500; // maximum time allowed to travel that distance
      var	elapsedTime;
      var	startTime;
      var	mouseisdown = false;
      var	detecttouch = !!('ontouchstart' in window) ||
                        !!('ontouchstart' in document.documentElement) ||
                        !!window.ontouchstart ||
                        !!window.Touch ||
                        !!window.onmsgesturechange ||
                        (window.DocumentTouch && window.document instanceof window.DocumentTouch);
      var	handletouch = callback || function(evt, dir, phase, swipetype, distance){};
      // touchstart handler
      touchsurface.addEventListener('touchstart', function(e) {
        var touchobj = e.changedTouches[0];
        dir = 'none';
        swipeType = 'none';
        dist = 0;
        startX = touchobj.pageX;
        startY = touchobj.pageY;
        startTime = new Date().getTime(); // record time when finger first makes contact with surface
        handletouch(e, 'none', 'start', swipeType, 0); // fire callback function with params dir="none", phase="start", swipetype="none" etc
        e.preventDefault();
      }, false);
      // touchmove handler
      touchsurface.addEventListener('touchmove', function(e) {
        var touchobj = e.changedTouches[0];
        distX = touchobj.pageX - startX; // get horizontal dist traveled by finger while in contact with surface
        distY = touchobj.pageY - startY; // get vertical dist traveled by finger while in contact with surface
        if (Math.abs(distX) > Math.abs(distY)) { // if distance traveled horizontally is greater than vertically, consider this a horizontal movement
          dir = (distX < 0)? 'left' : 'right';
          handletouch(e, dir, 'move', swipeType, distX); // fire callback function with params dir="left|right", phase="move", swipetype="none" etc
        }	else { // else consider this a vertical movement
          dir = (distY < 0)? 'up' : 'down';
          handletouch(e, dir, 'move', swipeType, distY); // fire callback function with params dir="up|down", phase="move", swipetype="none" etc
        }
        e.preventDefault(); // prevent scrolling when inside DIV
      }, false);
      // touchend handler
      touchsurface.addEventListener('touchend', function(e) {
        var touchobj = e.changedTouches[0];
        elapsedTime = new Date().getTime() - startTime; // get time elapsed
        if (elapsedTime <= allowedTime) { // first condition for awipe met
          if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) { // 2nd condition for horizontal swipe met
            swipeType = dir; // set swipeType to either "left" or "right"
          } else if (Math.abs(distY) >= threshold  && Math.abs(distX) <= restraint) { // 2nd condition for vertical swipe met
            swipeType = dir; // set swipeType to either "top" or "down"
          }
        }
        // fire callback function with params dir="left|right|up|down", phase="end", swipetype=dir etc:
        handletouch(e, dir, 'end', swipeType, (dir =='left' || dir =='right')? distX : distY);
        e.preventDefault();
      }, false);
      // mouse emulation of touchstart for non-touch device
      touchsurface.addEventListener('mousedown', function(e) {
        var touchobj = e;
        dir = 'none';
        swipeType = 'none';
        dist = 0;
        startX = touchobj.pageX;
        startY = touchobj.pageY;
        startTime = new Date().getTime(); // record time when finger first makes contact with surface
        handletouch(e, 'none', 'start', swipeType, 0); // fire callback function with params dir="none", phase="start", swipetype="none" etc
        mouseisdown = true;
        e.preventDefault();
      }, false);
      // mouse emulation of touchmove for non-touch device
      touchsurface.addEventListener('mousemove', function(e) {
        if (mouseisdown) {
          var touchobj = e;
          distX = touchobj.pageX - startX; // get horizontal dist traveled by finger while in contact with surface
          distY = touchobj.pageY - startY; // get vertical dist traveled by finger while in contact with surface
          if (Math.abs(distX) > Math.abs(distY)) { // if distance traveled horizontally is greater than vertically, consider this a horizontal movement
            dir = (distX < 0)? 'left' : 'right';
            handletouch(e, dir, 'move', swipeType, distX); // fire callback function with params dir="left|right", phase="move", swipetype="none" etc
          } else { // else consider this a vertical movement
            dir = (distY < 0)? 'up' : 'down';
            handletouch(e, dir, 'move', swipeType, distY); // fire callback function with params dir="up|down", phase="move", swipetype="none" etc
          }
          e.preventDefault(); // prevent scrolling when inside DIV
        }
      }, false);
      // mouse emulation of touchend for non-touch device
      touchsurface.addEventListener('mouseup', function(e) {
        if (mouseisdown) {
          var touchobj = e;
          elapsedTime = new Date().getTime() - startTime; // get time elapsed
          if (elapsedTime <= allowedTime) { // first condition for awipe met
            if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) { // 2nd condition for horizontal swipe met
              swipeType = dir; // set swipeType to either "left" or "right"
            } else if (Math.abs(distY) >= threshold  && Math.abs(distX) <= restraint) { // 2nd condition for vertical swipe met
              swipeType = dir; // set swipeType to either "top" or "down"
            }
          }
          // fire callback function with params dir="left|right|up|down", phase="end", swipetype=dir etc:
          handletouch(e, dir, 'end', swipeType, (dir =='left' || dir =='right')? distX : distY);
          mouseisdown = false;
          e.preventDefault();
        }
      }, false);
    }
    //
    function init(selectorOrRef, callback) {
      if (typeof(selectorOrRef) === "string") {
        selectorOrRef = document.querySelector(selectorOrRef);
      }
      ontouch(selectorOrRef, callback);
    }
    //
    return {
      init : init
    }
  })(); // SWIPER

  var SERVICE = (function() {
    //
    function getTemperatures() {
      return {"high": getRandomArbitrary(70,54), "low": getRandomArbitrary(50,39)};
    }
    //
    function getScheduled() {
      var schedules = [
        [0,1],[2,3],[1,5,6],[2,4,6],[4],[1],[2],[6],[3,6],[1,3],[5],[1,2,3],[0],[0,2,4],[0,1],[2,6],[1,3,4],[3,5],[1,4],[2,5]
      ];
      return schedules[Math.floor(Math.random()*schedules.length)];
    }
    //
    return {
      getTemperatures : getTemperatures,
      getScheduled : getScheduled
    }
  })(); // SERVICE


/**
 * Helper utilities
 */
//
function show(selectorOrRef, baseSelectorOrRef) {
  if (typeof(selectorOrRef) === "string") {
    getElementsForSelector(selectorOrRef, baseSelectorOrRef).forEach(function(e){e.classList.remove("hide")});
  } else {
    selectorOrRef.classList.remove("hide");
  }
}
//
function hide(selectorOrRef, baseSelectorOrRef) {
  if (typeof(selectorOrRef) === "string") {
    getElementsForSelector(selectorOrRef, baseSelectorOrRef).forEach(function(e){e.classList.add("hide")});
  } else {
    selectorOrRef.classList.add("hide");
  }
}
//
function showHide(selector) {
  (getElementsForSelector(selector)).forEach(function(e){(e.classList.contains("hide"))?show(e):hide(e);});
}
//
function containsClass(selectorOrRef, className) {
  if (typeof(selectorOrRef) === "string") {
    return document.querySelector(selectorOrRef).classList.contains(className);
  } else {
    return selectorOrRef.classList.contains(className);
  }
}
//
function toggleClass(selectorOrRef, className) {
  if (typeof(selectorOrRef) === "string") {
    document.querySelector(selectorOrRef).classList.toggle(className);
  } else {
    selectorOrRef.classList.toggle(className);
  }
}
//
function removeClass(selectorOrRef, className) {
  if (typeof(selectorOrRef) === "string") {
    document.querySelector(selectorOrRef).classList.remove(className);
  } else {
    selectorOrRef.classList.remove(className);
  }
}
//
function addClass(selectorOrRef, className) {
  if (typeof(selectorOrRef) === "string") {
    document.querySelector(selectorOrRef).classList.add(className);
  } else {
    selectorOrRef.classList.add(className);
  }
}
//
/*
  gets elements specified by selector
  selector is a string of the selector expression
  baseSelectorOrRef is optional
  if baseSelectorOrRef is passed in, the selection of selector is performed with baseSelectorOrRef as root
  if baseSelectorOrRef is not passed in, the selection of selector is performed with document as root
  baseSelectorOrRef can be a string of the selector expression to be used as root
  baseSelectorOrRef can be a reference to the dom element to be used as root
  returns an array of selected elements
  returns empty array on error
*/
function getElementsForSelector(selector, baseSelectorOrRef) {
  var baseRef = document;
  if (baseSelectorOrRef) {
    baseRef = (typeof(baseSelectorOrRef)==="string")?document.querySelector(baseSelectorOrRef):baseSelectorOrRef;
  }
  return [].slice.call(baseRef.querySelectorAll(selector)); // convert nodeList to array
}
//
function go(url) {
  location.replace(url);
}
//
function html(selectorOrRef, newHtml) {
  var ref = (typeof(selectorOrRef)==="string")?document.querySelector(selectorOrRef):selectorOrRef;
  if (typeof(newHtml) !== "undefined") {
    ref.innerHTML = newHtml;
  } else {
    return ref.innerHTML;
  }
}
//
function text(selectorOrRef, newText) {
  var ref = (typeof(selectorOrRef)==="string")?document.querySelector(selectorOrRef):selectorOrRef;
  if (typeof(newText) !== "undefined") {
    ref.textContent = newText;
  } else {
    return (ref.textContent).trim();
  }
}
//
function getRandomArbitrary(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}
/* Helper utilities */
