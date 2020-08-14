/* eslint-disable */

const helpers = {
    IsIEBrowser: function() {
      let ua = window.navigator.userAgent;
  
      // test values
      // IE 10
      //ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';
      // IE 11
      //ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';
      // IE 12 / Spartan
      //ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';
  
      let msie = ua.indexOf('MSIE ');
      if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
      }
  
      let trident = ua.indexOf('Trident/');
      if (trident > 0) {
        // IE 11 => return version number
        let rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
      }
  
      let edge = ua.indexOf('Edge/');
      if (edge > 0) {
        // IE 12 => return version number
        return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
      }
      return false;
    },
    docCookies: {
      getItem: function(sKey) {
        if (!sKey) {
          return null;
        }
  
        try {
          return decodeURIComponent(document.cookie.replace(new RegExp('(?:(?:^|.*;)\\s*' + encodeURIComponent(sKey).replace(/[-.+*]/g, '\\$&') + '\\s*\\=\\s*([^;]*).*$)|^.*$'), '$1')) || null;
        }
        catch (e) {
          return null;
        }
      },
      setItem: function(sKey, sValue, vEnd, sPath, sDomain, bSecure) {
        if (!sKey || /^(?:expires|max-age|path|domain|secure)$/i.test(sKey)) {
          return false;
        }
        let sExpires = '';
        if (vEnd) {
          switch (vEnd.constructor) {
            case Number:
              sExpires = vEnd === Infinity ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT' : '; max-age=' + vEnd;
              /*
              Note: Despite officially defined in RFC 6265, the use of `max-age` is not compatible with any
              version of Internet Explorer, Edge and some mobile browsers. Therefore passing a number to
              the end parameter might not work as expected. A possible solution might be to convert the the
              relative time to an absolute time. For instance, replacing the previous line with:
              */
              /*
              sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; expires=" + (new Date(vEnd * 1e3 + Date.now())).toUTCString();
              */
              break;
            case String:
              sExpires = '; expires=' + vEnd;
              break;
            case Date:
              sExpires = '; expires=' + vEnd.toUTCString();
              break;
          }
        }
        document.cookie = encodeURIComponent(sKey) + '=' + encodeURIComponent(sValue) + sExpires + (sDomain ? '; domain=' + sDomain : '') + (sPath ? '; path=' + sPath : '') + (bSecure ? '; secure' : '');
        return true;
      },
      removeItem: function(sKey, sPath, sDomain) {
        if (!this.hasItem(sKey)) {
          return false;
        }
        document.cookie = encodeURIComponent(sKey) + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT' + (sDomain ? '; domain=' + sDomain : '') + (sPath ? '; path=' + sPath : '');
        return true;
      },
      hasItem: function(sKey) {
        if (!sKey || /^(?:expires|max-age|path|domain|secure)$/i.test(sKey)) {
          return false;
        }
        return (new RegExp('(?:^|;\\s*)' + encodeURIComponent(sKey).replace(/[-.+*]/g, '\\$&') + '\\s*\\=')).test(document.cookie);
      },
      keys: function() {
        let aKeys = document.cookie.replace(/((?:^|\s*;)[^=]+)(?=;|$)|^\s*|\s*(?:=[^;]*)?(?:\1|$)/g, '').split(/\s*(?:=[^;]*)?;\s*/);
        for (let nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) {
          aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
        }
        return aKeys;
      },
    },
    getParameterByName: (name, url) => {
      if (!url) url = window.location.href;
      name = name.replace(/[[\]]/g, '\\$&');
      const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, ' '));
    },
    getParameters: (url) => {
      if (!url) url = window.location.href;
      if (url.indexOf('?') !== -1) {
        const params = url.split('?')[1];
  
        try {
          return JSON.parse('{"' + decodeURI(params.replace(/&/g, '\",\"').replace(/=/g,'\":\"')) + '"}');
        } catch (e) {
          return {};
        }
      } else {
        return {};
      }
    },
    isMobile: function() {
      /* http://detectmobilebrowsers.com */
      let check = false;
      (function(a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) ||
          /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i.test(
            a.substr(0, 4))) {
          check = true;
        }
      })(navigator.userAgent || navigator.vendor || window.opera);
      return check;
    },
    pushStateHistory: function(subfix = '') {
      let path = location.protocol + '//' + location.host + location.pathname;
      path += subfix;
      history.pushState({path: path}, '', path);
    },
    getSimulatedGUID: function() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
      }
  
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    },
    initNewEvent: function(eventName, bubble = false) {
      if ('function' === typeof(Event)) {
        return new Event(eventName, {bubbles: bubble});
      } else {
        /*for IE11*/
        const event = document.createEvent('Event');
        event.initEvent(eventName, true, true);
        return event;
      }
    },
    obj: {
      getProp: function(obj, prop) {
        let val = null;
        Object.keys(obj).forEach(function(key) {
          if (key.toLowerCase() === prop.toLowerCase()) {
            val = obj[key];
          }
        });
  
        return val;
      },
      removeProp: function(obj, prop) {
        Object.keys(obj).forEach(function(key) {
          if (key.toLowerCase() === prop.toLowerCase()) {
            delete obj[key];
          }
        });
  
        return obj;
      },
    },
    onWindowEvents: function(foo, isReady, isLoad, isResize, isScroll) {
      if (isReady) {
        $(document).ready(foo);
      }
  
      if (isLoad) {
        $(window).bind('load', foo);
      }
  
      if (isResize) {
        const throttleResizing = _.throttle(foo, 100);
        $(window).bind('resize', throttleResizing);
      }
  
      if (isScroll) {
        const throttleScroll = _.throttle(foo, 10);
        $(window).bind('scroll', throttleScroll);
      }
    },
    getCurrentDomain: function(hostName = '') {
      if ('' === hostName) {
        hostName = window.location.host;
      }
      let domain = hostName;
  
      if (hostName != null) {
        let parts = hostName.split('.').reverse();
  
        if (parts != null && parts.length > 1) {
          domain = parts[1] + '.' + parts[0];
  
          if (hostName.toLowerCase().indexOf('.com.au') !== -1 && parts.length > 2) {
            domain = parts[2] + '.' + domain;
          }
        }
      }
  
      return domain;
    },
    autoHeightAnimate: function(element, time) {
      /*TODO: LATER >> improve equal height row by row, not all*/
      var curHeight = element.height(), // Get Default Height
        autoHeight = element.css('height', 'auto').height(); // Get Auto Height
      element.height(curHeight); // Reset to Default Height
      element.stop().animate({height: autoHeight}, parseInt(time)); // Animate to Auto Height
    },
    decodeHTML: function(html) {
      const txt = document.createElement('textarea');
      txt.innerHTML = html;
      return txt.value;
    },
    escapeAttrNodeValue: function(value) {
      if (null !== value) {
        return value.replace(/(&)|(")|(\u00A0)/g, function(match, amp, quote) {
          if (amp) return '&amp;';
          if (quote) return '&quot;';
          return '&nbsp;';
        });
      }
      return '';
    },
    getFormattedCurrency: function(currencyCode) {
      switch (currencyCode.toUpperCase()) {
        case 'AUD':
          return 'AU$';
        case 'NZD':
          return 'NZ$';
        case 'GBP':
          return '£';
        default:
          return '$';
      }
    },
    equalHeightElements: function(container, clr, gapDelta) {
      clr = (typeof clr !== 'undefined' ? clr : false);
      gapDelta = (typeof gapDelta !== 'undefined' ? gapDelta : 10);
      var currentTallest = 0,
        currentRowStart = 0,
        rowDivs = [],
        el,
        currentDiv,
        topPosition = 0;
      var c = jQuery(container).filter(':visible');
      if (c.length <= 1) {
        return false;
      }
      if (!clr) {
        c.css('min-height', 0);
      } else {
        c.removeAttr('style');
      }
      c.each(function() {
        el = jQuery(this);
        topPosition = el.offset().top;
        if ((currentRowStart < (topPosition + gapDelta)) && (currentRowStart > (topPosition - gapDelta))) {
          rowDivs.push(el);
          currentTallest = (currentTallest < el.outerHeight()) ? (el.outerHeight()) : (currentTallest);
        } else {
          for (currentDiv = 0; currentDiv < rowDivs.length; currentDiv++) {
            rowDivs[currentDiv].css('min-height', currentTallest + 'px');
          }
          rowDivs.length = 0; // empty the array
          currentRowStart = topPosition;
          currentTallest = el.outerHeight();
          rowDivs.push(el);
        }
        for (currentDiv = 0; currentDiv < rowDivs.length; currentDiv++) {
          rowDivs[currentDiv].css('min-height', currentTallest + 'px');
        }
      });
      return true;
    },
    getAlertHtml: function(message, type) {
      return ('' +
        '<div class="alert alert-' + type + '" role="alert">' +
        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
        '<span aria-hidden="true">×</span>' +
        '</button>' + message +
        '</div>');
    },
    freezeDefault: function(e) {
      e.preventDefault();
    },
    isValidEmail: function(emailAddress) {
      let validEmail = false;
      if (emailAddress.length) {
        const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (regex.test(emailAddress)) {
          validEmail = true;
        }
      }
      return validEmail;
    },
    isScrolledIntoView: function(element) {
      const docViewTop = $(window).scrollTop();
      const docViewBottom = docViewTop + $(window).height();
  
      const elemTop = $(element).offset().top;
      const elemBottom = elemTop + $(element).height();
  
      return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
    },
    addBrowserClass: function() {
      if(navigator.appVersion.indexOf('Win')!=-1) {
        $('body').addClass('window-os');
      }
  
      if(navigator.platform.toUpperCase().indexOf('MAC')>=0) {
        $('body').addClass('mac-os');
      }
  
      if(navigator.appVersion.indexOf('Linux')!=-1) {
        $('body').addClass('linux-os');
      }
  
      /* Add class for all ie version */
      const trident = !!navigator.userAgent.match(/Trident\/7.0/);
      const net = !!navigator.userAgent.match(/.NET4.0E/);
      const IE11 = trident && net;
      const IEold = ( navigator.userAgent.match(/MSIE/i) ? true : false );
  
      if(IE11 || IEold){
        $('body').addClass('ie');
      }
  
      const ua = navigator.userAgent.toLowerCase();
  
      if (ua.indexOf('safari') != -1) {
        if (ua.indexOf('chrome') > -1) {
          $('body').addClass('chrome');
        } else {
          $('body').addClass('safari');
        }
      }
  
      const FF = !(window.mozInnerScreenX == null);
  
      if(FF) {
        $('body').addClass('fire-fox');
      }
      /* End */
  
    },
    viewBreakpoints: function(breakpoint) {
      switch (breakpoint) {
        case 'sm':
          return 640;
        case 'md':
          return 768;
        case 'lg':
          return 1024;
        case 'xl':
          return 1280;
        default:
          return 0;
      }
    },
    adminBarHeight: function() {
      if(this.isMobile()) {
        return 46;
      } else {
        return 32;
      }
    }
  };
  
  export default helpers;
  