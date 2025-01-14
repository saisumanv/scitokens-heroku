
function parseQueryString(qs) {
  var d = {};
  qs = qs.split('&');
  qs.forEach(function (kv) { kv = kv.split('='); d[kv[0]] = kv[1]; });
  return d;
}

function parseSearch() {
  return parseQueryString(document.location.search.slice(1));
}

function parseHash() {
  return parseQueryString(document.location.hash.slice(1));
}

if (parseSearch().value || parseHash().id_token) {
  scrollTo($('#debugger-io'));
}

function safeLocalStorageSetItem(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    // Safari when in private browsing doesn't allow it
  }
}
safeLocalStorageSetItem("visited", "1");

/*
 * Go to url hash from intro section
 */
if (location.href.indexOf("#debugger") != -1) {
  scrollTo($('#debugger-io'));
}

if (location.href.indexOf("#libraries") != -1) {
  scrollTo($('#libraries-io'));
}

/*
 * hljs
 */
hljs.configure({
  classPrefix: ''
});

$('.plain-text pre code').each(function(i, block) {
  var $snippet = $(this);

  if(!$snippet.hasClass('hljs')) {
    hljs.highlightBlock(block);
    hljs.lineNumbersBlock(block);
    $snippet.addClass('hljs');
  }
});

/*
 * Show icon
 */
$(window).scroll(function() {
  if ($(window).scrollTop() >= 130) {
    $("nav.navbar").addClass("fixed");
  } else {
    $("nav.navbar").removeClass("fixed");
  }
});

/*
 * Show menu mobile
 */
function scrollTo($target) {
  var navheight = $(".navbar").height();

  if (window.matchMedia('(min-width: 768px)').matches) {
    $('html, body').animate({
      scrollTop: $target.offset().top - navheight
    }, 500);
  } else {
    $('html, body').animate({
      scrollTop: $target.offset().top
    }, 500);
  }
}

$('.menu-trigger').on('click', function() {
  $(this).toggleClass('active');
  $('.navbar').toggleClass('open');
  $('body').toggleClass('menu-mobile');
});

$('.navbar .menu a').on('click', function() {
  $('.menu-trigger').removeClass('active');
  $('.navbar').removeClass('open');
  $('body').removeClass('menu-mobile');
});

/*
 * Accordion
 */
$('.accordion').accordion({
  "transitionSpeed": 400
});

/*
 * Scroll to section
 */
$('a[href^="#"].scrollto').on('click', function(event) {
  var target = $( $(this).attr('href') );

  if( target.length ) {
    event.preventDefault();
    scrollTo(target);
  }
});

$(window).on('scroll', function () {
  var $submenu = $('.navbar');
  var navheight = $(".navbar").height();
  var sections = $('section');
  var cur_pos = $(window).scrollTop();

  sections.each(function() {
    var top = $(this).offset().top - navheight;
    var bottom = top + $(this).outerHeight();

    if (cur_pos >= top && cur_pos <= bottom) {
      $submenu.find('a.scrollto').removeClass('active').closest('nav.menu').removeClass('active');

      $submenu.find('a.scrollto[href="#' + $(this).attr('id') + '"]').addClass('active').closest('nav.menu').addClass('active');
    }
  });
});

function autoHeightInput() {
  var outputHeight = $('#decoded-jwt .output').outerHeight(),
    inputHeight = $('#encoded-jwt .input');

  inputHeight.css('height', outputHeight + 'px');
}

/*
 * token counter
 */
/*
var numberOfLogins = 80482701;
var pollfreqWhenVisible = 5000;
var pollfreqWhenHidden = 1000*1000;
var pollfreq;

function isScrolledIntoView(elem) {
  var docViewTop = $(window).scrollTop();
  var docViewBottom = docViewTop + $(window).height();

  var elemTop = $(elem).offset().top;
  var elemBottom = elemTop + $(elem).height();

  return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}

function updatePollFreqIfVisible(elem) {
  pollfreq = isScrolledIntoView($('.counter')) ? pollfreqWhenVisible : pollfreqWhenHidden;
  return setTimeout(function () {
    updatePollFreqIfVisible(elem);
  }, 500);
}

function poll() {
  updateNumberOfLogins(function() {
    return setTimeout(function () {
      poll();
    }, pollfreq);
  });
}

function updateNumberOfLogins(callback) {
  $.ajax({
    url: "https://webtask.it.auth0.com/api/run/wt-matiasw-gmail_com-0/proxy?url=http://metrics.it.auth0.com/counters",
    cache: false
  }).done(function(response) {
    numberOfLogins = response.logins;
    if (callback) callback();
  });
}

updateNumberOfLogins();
updatePollFreqIfVisible();

var clock = $('.counter').FlipClock(numberOfLogins, {
  clockFace: 'Counter',
  minimumDigits: ('' + numberOfLogins).length
});

setInterval(function() {
  if (clock.time.time < numberOfLogins) {
    clock.setTime(numberOfLogins);
  }
}, 1000);

poll();

*/
if (navigator.userAgent.indexOf('Mac OS X') != -1) {
  $("body").addClass("mac");
} else {
  $("body").addClass("pc");
}


$(".jwt-playground .tab-link a").click(function() {
  var container = $(this).parentsUntil(".jwt-playground").parent();
  if (!$(this).parent().hasClass("current")) {
    container.find(".tab-nav .current").removeClass("current");
    $(this).parent().addClass("current");
    container.find(".tab-content .box-content").removeClass('current');
    $($(this).attr("href")).addClass('current');
  }
  return false;
});

var $grid = $('.libraries-sv').isotope({
  layoutMode: 'fitRows',
  itemSelector: 'article',
  percentPosition: true,
  masonry: {
    columnWidth: 'article'
  }
});

$('.filter select').on( 'change', function() {
  $grid.isotope({ filter: $(this).val() });
});

$(".panel-default .panel-heading").click(function() {
  if ($(this).hasClass("active")) {
    $(".panel-default .panel-heading").removeClass("active");
    $(".panel-default .panel-wrap").slideUp(300);
  } else {
    $(".panel-default .panel-heading").removeClass("active");
    $(".panel-default .panel-wrap").slideUp(300);
    $(this).addClass("active");
    $(this).next(".panel-wrap").slideDown(300);
  }
  return false;
});

// Principal JWT JS **

(function () {
  // Taken from http://stackoverflow.com/questions/2490825/how-to-trigger-event-in-javascript
  function fireEvent(element) {
    var event; // The custom event that will be created

    if (document.createEvent) {
      event = document.createEvent('HTMLEvents');
      event.initEvent('change', true, true);
    } else {
      event = document.createEventObject();
      event.eventType = 'change';
    }

    event.eventName = 'change';

    if (document.createEvent) {
      element.dispatchEvent(event);
    } else {
      element.fireEvent('on' + event.eventType, event);
    }
  }

  var DEFAULT_HS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ';

  var DEFAULT_RS_TOKEN = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2RlbW8uc2NpdG9rZW5zLm9yZyIsImlhdCI6MTUwNzA0MDI0NC41NjY0ODksImV4cCI6MTUwNzA0MDg0NC41NjY0ODl9.orvQ2wWTRXEoTb3ysoKc1L924p16dvjIfq2oMV1AXfl1BHQZYvQyZ9Yu46xOpA7t2zpUs9NiPCQV8nsU7k_BTo-UqB0DRemKK3p7-KUkBzgvCzPD7133GFxcPuyI_LmjJSHMEhGj0dcWvy448xB0TUVswMQJT9HncEa0tTdabjGMxkLgr9vAxas7KygpDy-qrvievKghBJg5Yr8bggr3w974_keeED6Zs55jERQUOjPHMFYYl0UvGbnP4WORasX2MMiybku7i8yG9B0Sbdtjp9QJ_Tj9Z_99H_9hTt7b8Gqh4LXnPgl1RSdHqfScHGOSg1QDyk9gqE2RRSveEe24rA'

  //var DEFAULT_RS_TOKEN = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.EkN-DOsnsuRjRO6BxXemmJDm3HbxrbRzXglbN2S4sOkopdU4IsDxTI8jO19W_A4K8ZPJijNLis4EZsHeY559a4DFOd50_OqgHGuERTqYZyuhtF39yxJPAjUESwxk2J5k_4zM3O-vtd1Ghyo4IbqKKSy6J9mTniYJPenn5-HIirE';

  var DEFAULT_PUBLIC_RSA = "\
-----BEGIN PUBLIC KEY-----\n\
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuGDGTLXnqh3mfopjys6s\
FUBvFl3F4Qt6NEYphq/u/aBhtN1X9NEyb78uB/I1KjciJNGLIQU0ECsJiFx6qV1h\
R9xE1dPyrS3bU92AVtnBrvzUtTU+aUZAmZQiuAC/rC0+z/TOQr6qJkkUgZtxR9n9\
op55ZBpRfZD5dzhkW4Dm146vfTKt0D4cIMoMNJS5xQx9nibeB4E8hryZDW/fPeD0\
XZDcpByNyP0jFDYkxdUtQFvyRpz4WMZ4ejUfvW3gf4LRAfGZJtMnsZ7ZW4RfoQbh\
iXKMfWeBEjQDiXh0r+KuZLykxhYJtpf7fTnPna753IzMgRMmW3F69iQn2LQN3LoS\
MwIDAQAB\n\
-----END PUBLIC KEY-----\
  "
  var DEFAULT_PUBLIC_EC = "\
-----BEGIN PUBLIC KEY-----\n\
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEncSCrGTBTXXOhNiAOTwNdPjwRz1h\
VY4saDNiHQK9Bh6wKwVe/HsUACSXCrcLNEIFyCGpk4U8HZ0pRrJLotj8ug==\n\
-----END PUBLIC KEY-----\
  "

/*
  var DEFAULT_PUBLIC_RSA = "\
-----BEGIN PUBLIC KEY-----\n\
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDdlatRjRjogo3WojgGHFHYLugd\
UWAY9iR3fy4arWNA1KoS8kVw33cJibXr8bvwUAUparCwlvdbH6dvEOfou0/gCFQs\
HUfQrSDv+MuSUMAe8jzKE4qW+jK+xQU9a03GUnKHkkle+Q0pX/g6jXZ7r1/xAK5D\
o2kQ+X5xK9cipRgEKwIDAQAB\n\
-----END PUBLIC KEY-----\
  ";
*/

  var DEFAULT_PRIVATE_RSA = "\
-----BEGIN RSA PRIVATE KEY-----\n\
MIICWwIBAAKBgQDdlatRjRjogo3WojgGHFHYLugdUWAY9iR3fy4arWNA1KoS8kVw\
33cJibXr8bvwUAUparCwlvdbH6dvEOfou0/gCFQsHUfQrSDv+MuSUMAe8jzKE4qW\
+jK+xQU9a03GUnKHkkle+Q0pX/g6jXZ7r1/xAK5Do2kQ+X5xK9cipRgEKwIDAQAB\
AoGAD+onAtVye4ic7VR7V50DF9bOnwRwNXrARcDhq9LWNRrRGElESYYTQ6EbatXS\
3MCyjjX2eMhu/aF5YhXBwkppwxg+EOmXeh+MzL7Zh284OuPbkglAaGhV9bb6/5Cp\
uGb1esyPbYW+Ty2PC0GSZfIXkXs76jXAu9TOBvD0ybc2YlkCQQDywg2R/7t3Q2OE\
2+yo382CLJdrlSLVROWKwb4tb2PjhY4XAwV8d1vy0RenxTB+K5Mu57uVSTHtrMK0\
GAtFr833AkEA6avx20OHo61Yela/4k5kQDtjEf1N0LfI+BcWZtxsS3jDM3i1Hp0K\
Su5rsCPb8acJo5RO26gGVrfAsDcIXKC+bQJAZZ2XIpsitLyPpuiMOvBbzPavd4gY\
6Z8KWrfYzJoI/Q9FuBo6rKwl4BFoToD7WIUS+hpkagwWiz+6zLoX1dbOZwJACmH5\
fSSjAkLRi54PKJ8TFUeOP15h9sQzydI8zJU+upvDEKZsZc/UhT/SySDOxQ4G/523\
Y0sz/OZtSWcol/UMgQJALesy++GdvoIDLfJX5GBQpuFgFenRiRDabxrE9MNUZ2aP\
FaFp+DyAe+b4nDwuJaW2LURbr8AEZga7oQj0uYxcYw==\n\
  -----END RSA PRIVATE KEY-----\
  ";
  var updateAll = false;

  var codeMirror = CodeMirror;

  function tabHack(instance) {
    instance.replaceSelection('   ' , 'end');
  }

  var tokenEditor = codeMirror(document.getElementsByClassName('js-input')[0], {
    mode:           'jwt',
    theme:          'night',
    lineWrapping:   true,
    // autofocus:      true,
    extraKeys: { 'Tab':  tabHack}
  });

  var headerEditor = codeMirror(document.getElementsByClassName('js-header')[0], {
    mode:           'application/json',
    lineWrapping:   true,
    extraKeys: { 'Tab':  tabHack},
    lint: true,
    readOnly: true
  });

  var payloadEditor = codeMirror(document.getElementsByClassName('js-payload')[0], {
    mode:           'application/json',
    lineWrapping:   true,
    extraKeys: { 'Tab':  tabHack},
    lint: true
  });
  
  var curlCommand = codeMirror(document.getElementsByClassName('js-curlcommand')[0], {
    mode:           'shell',
    lineWrapping:   true,
    readOnly: true
  });
  
  

  algorithmRadios = $('option[name="algorithm"]');
  var tokenRadios = $('input[name="token-type"]');
  
  $('#algorithm-select').change(function() {
    refreshTokenEditor();
    
  });

  function setJSONEditorContent(jsonEditor, decodedJSON, selector) {
    jsonEditor.off('change', lazyRefreshTokenEditor);

    if (decodedJSON.result !== null && decodedJSON.result !== undefined) {
      jsonEditor.setValue(decodedJSON.result);
    } else {
      jsonEditor.setValue('');
    }
    if (decodedJSON.error) {
      selector.addClass('error');
    } else {
      selector.removeClass('error');
    }

    jsonEditor.on('change', lazyRefreshTokenEditor);

  }
  
  curlCommand.on('focus', function() {
    curlCommand.execCommand("selectAll");
  })

  function updateCurlCommand(serialized_token) {
    curlCommand.setValue("curl -H \"Authorization: Bearer " + serialized_token + "\" https://demo.scitokens.org/protected")
  }
  
  $("#protectedPayload").on("click", function(e) {
    
    payloadEditor.setValue("{\"scope\":\"read:/protected\", \"aud\": \"https://demo.scitokens.org\"}")
    updateAll = true;
    refreshTokenEditor()
  })

  function tokenEditorOnChangeListener(instance) {
    var value = getTrimmedValue(instance);

    if (!value) { return; }

    var parts = value.split('.');

    //var secretElement = document.getElementsByName('secret')[0];
    var signatureElement = getFirstElementByClassName('js-signature');

    if (!signatureElement) {
      return;
    }

    var decodedHeader = window.decode(parts[0]);

    /*
    try {
      selectDetectedAlgorithm(JSON.parse(decodedHeader.result).alg);
    }catch (e){
      console.error('Invalid header decoded');
    }
    */

    var selector = $('.jwt-header');
    setJSONEditorContent(headerEditor, decodedHeader, selector);
    var decodedPayload = window.decode(parts[1]);
    selector = $('.jwt-payload');
    setJSONEditorContent(payloadEditor, decodedPayload, selector);

    updateSignature();
    //fireEvent(secretElement);
    updateCurlCommand(value);

    if (window.matchMedia('(min-width: 768px)').matches) {
      autoHeightInput();
    }
  }

  function selectDetectedAlgorithm(alg){
    var $algRadio = $('.algorithm input[value="'+alg+'"]');
    $algRadio.prop('checked', true);

    //fireEvent($algRadio.get(0));
    refreshTokenEditor()
  }

  function saveToStorage(jwt) {
    // Save last valid jwt value for refresh
    safeLocalStorageSetItem("jwtValue", jwt);
  }

  function loadFromStorage(cb) {
    cb(localStorage.getItem("jwtValue"));
    localStorage.removeItem("jwtValue");
  }

  function refreshTokenEditor() {
    tokenEditor.off('change', tokenEditorOnChangeListener);
    try {
      header = JSON.parse(headerEditor.getValue());
      payload = JSON.parse(payloadEditor.getValue());
    } catch(e) {
      tokenEditor.setValue(''); 
      var elements = {'payload': '.jwt-payload', 'header': '.jwt-header'};
      $('.jwt-payload').addClass('error');
      $('.jwt-header').addClass('error');
      $('.input').addClass('error');
      
      tokenEditor.on('change', tokenEditorOnChangeListener);
      updateSignature();
      return;
    }

    $.ajax({
        type: "POST",
        url: "/issue",
        data: JSON.stringify({ header: header, payload: payload,
                               algorithm: $('#algorithm-select option:selected').val()}),
        contentType: "application/json; charset=utf-8",
        success: function(data){
          tokenEditor.setValue(data);
          
          $('.input').removeClass('error');
          $('.jwt-payload').removeClass('error');
          $('.jwt-header').removeClass('error');

          saveToStorage(data);
          tokenEditor.on('change', tokenEditorOnChangeListener);
          updateAll = true;
          if (updateAll) {
            tokenEditorOnChangeListener(tokenEditor);
            updateAll = false;
          }
          updateSignature();
          updateCurlCommand(data);
          //fireEvent(secretElement);
        },
        error: function(errMsg) {
            tokenEditor.setValue('');
            
            var elements = {'payload': '.jwt-payload', 'header': '.jwt-header'};
            $('.jwt-payload').addClass('error');
            $('.jwt-header').addClass('error');
            $('.input').addClass('error');
            
            tokenEditor.on('change', tokenEditorOnChangeListener);
            updateSignature();
            //fireEvent(secretElement);
        }
      });

  
  }

  function getFirstElementByClassName(selector) {
    var headerElement = document.getElementsByClassName(selector);
    return headerElement.length ? headerElement[0] : null;
  }

  function getTrimmedValue(instance) {
    var value = instance.getValue();
    if (!value) {
      return null;
    }

    return value.replace(/\s/g, '');
  }

  tokenEditor.on('change', tokenEditorOnChangeListener);
  var lazyRefreshTokenEditor = _.debounce(refreshTokenEditor, 600);

  payloadEditor.on('change',  lazyRefreshTokenEditor);
  headerEditor.on('change',   lazyRefreshTokenEditor);

  var secretElement = document.getElementsByName('secret')[0];
  var isBase64EncodedElement = document.getElementsByName('is-base64-encoded')[0];


  function updateSignature () {
	
    
    var algorithm = getAlgorithm();
    var signatureElement = getFirstElementByClassName('js-signature');
    var signatureContainerElement = getFirstElementByClassName('jwt-signature');

    if (!signatureElement) {
      return;
    }
    var value = getTrimmedValue(tokenEditor);
    //var isBase64 = isBase64EncodedElement.checked;
    
    /*if (isBase64 && !window.isValidBase64String(secretElement.value)) {
      $(signatureContainerElement).addClass('error');
      return;
    } else {
      $(signatureContainerElement).removeClass('error');
    }*/
    

    var result = false;
    if (algorithm == "RS256") {
		//Get the pasted token
		newToken = tokenEditor.getValue();
		
      $.ajax({
		type:"POST",
        url: "verify",
		data: JSON.stringify({ token: newToken}),
        contentType: "application/json; charset=utf-8",
          
		success: function(data){
          
			response_msg = data.Error
			$('.input').removeClass('error');
			$('.jwt-payload').removeClass('error');
			$('.jwt-header').removeClass('error');
			$(signatureElement).removeClass('invalid-token');
			$(signatureElement).addClass('valid-token');
			signatureElement.innerHTML = response_msg;//'<i class="icon-budicon-499"></i> signature verified';
			
        },
        error: function(errMsg) {
			
			response_msg = data.Error
			$('.jwt-payload').addClass('error');
			$('.jwt-header').addClass('error');
			$('.input').addClass('error');
		 
			signatureElement.innerHTML = response_msg;
			$(signatureElement).removeClass('valid-token');
			$(signatureElement).addClass('invalid-token');
			signatureElement.innerHTML = '<i class="icon-budicon-501"></i> invalid signature';
      }
          
      });//*/
	  /*
	  //Remove?
      result = window.verify(
        "RS256",
        value,
        DEFAULT_PUBLIC_RSA,
        false
      );*/
    } else if (algorithm == "ES256") {
      result = window.verify(
        "ES256",
        value,
        DEFAULT_PUBLIC_EC,
        false
      );
	  tokenEditor.setValue('ERROR');
    }

    var error = result.error;
    result = result.result;
    if (!error && result) {
      $(signatureElement).removeClass('invalid-token');
      $(signatureElement).addClass('valid-token');
      signatureElement.innerHTML = '<i class="icon-budicon-499"></i> signature verified';
    } else {
      $(signatureElement).removeClass('valid-token');
      $(signatureElement).addClass('invalid-token');
      signatureElement.innerHTML = '<i class="icon-budicon-501"></i> invalid signature';
    }
  }

  function getKey(algorithm, action) {
    var secretElement = $('input[name="secret"]');
    var privateKeyElement = $('textarea[name="private-key"]');
    var publicKeyElement = $('textarea[name="public-key"]');

    if(algorithm === 'HS256') {
      return secretElement.val();
    } else {
      return action === 'sign' ? privateKeyElement.val() : publicKeyElement.val();
    }
  }

  function getAlgorithm() {
    //return 'RS256';
    return algorithmRadios.filter(':selected').val();
  }

  function updateAlgorithm () {
    var algorithm = algorithmRadios.filter(':selected').val();
    //algorithm = "RS256"

    $('.js-input').attr('data-alg', algorithm);

    $('.jwt-signature pre')
        .hide()
        .filter('.' + algorithm)
        .show();

    if(getTokenType() === 'id_token' && getTrimmedValue(tokenEditor) === DEFAULT_HS_TOKEN &&
      algorithm === 'RS256'){
      setDefaultsForRSA();
    }else if(getTokenType() === 'id_token' && getTrimmedValue(tokenEditor) === DEFAULT_RS_TOKEN &&
      algorithm === 'HS256'){
      setDefaultsForHMAC();
    }
  }

  function setDefaultsForRSA() {
    tokenEditor.setValue(DEFAULT_RS_TOKEN);

    $('.jwt-signature textarea[name=public-key]').val(DEFAULT_PUBLIC_RSA);
    $('.jwt-signature textarea[name=private-key]').val(DEFAULT_PRIVATE_RSA);
  }

  function setDefaultsForHMAC(){
    tokenEditor.setValue(DEFAULT_HS_TOKEN);
  }

  function updateToken() {
    var tokenType = getTokenType();
    if (document.location.hash) {
      var qs = document.location.hash.slice(1);
      var d = {};
      qs = qs.split('&');
      qs.forEach(function (kv) { kv = kv.split('='); d[kv[0]] = kv[1]; });

      if (d[tokenType]) {
        tokenEditor.setValue(decodeURIComponent(d[tokenType]));
        return;
      }
    }
  }

  function getTokenType() {
    return tokenRadios.filter(':checked').val();
  }

  function validateKey() {
    var $textarea = $(this);
    var valid;

    if($textarea.prop('name') === 'public-key') {
      valid = /-----BEGIN (PUBLIC KEY|CERTIFICATE)-----(.|\n)*-----END (PUBLIC KEY|CERTIFICATE)-----/.test($textarea.val());
    } else {
      valid = /-----BEGIN RSA PRIVATE KEY-----(.|\n)*-----END RSA PRIVATE KEY-----/.test($textarea.val());
    }

    if (valid) {
      $textarea.removeClass('error');
    } else {
      $textarea.addClass('error');
    }
  }

  updateAlgorithm();

  algorithmRadios.on('change', function(){
    updateAlgorithm();
    refreshTokenEditor();
    updateSignature();
    var value = getTrimmedValue(tokenEditor);
    updateCurlCommand(value);
  });

  tokenRadios.on('change', function(){
    updateToken();
    updateAlgorithm();
    updateSignature();
  });
  
  // When the page first loads, grab a new token from the backend
  $.ajax({
      type: "GET",
      url: "issue",
      success: function(data){
        tokenEditor.setValue(data);
        
        $('.input').removeClass('error');
        $('.jwt-payload').removeClass('error');
        $('.jwt-header').removeClass('error');

        saveToStorage(data);
        updateSignature();
		signatureElement.innerHTML = '<i class="icon-budicon-501"></i> Paste your Token';//TODO- this does not set the defaut status :(
        //fireEvent(secretElement);
      },
      error: function(errMsg) {
          tokenEditor.setValue('ERROR RETRIEVING DEFAULT TOKEN');
          var elements = {'payload': '.jwt-payload', 'header': '.jwt-header'};
          $('.jwt-payload').addClass('error');
          $('.jwt-header').addClass('error');
          $('.input').addClass('error');
          
		  
          //fireEvent(secretElement);
      }
    });
  
  


  var qs;
  var d;
  if (document.location.search) {
    qs = document.location.search.slice(1);
    d = {};
    qs = qs.split('&');
    qs.forEach(function (kv) { kv = kv.split('='); d[kv[0]] = kv[1]; });
    if (d.value) {
      tokenEditor.setValue(decodeURIComponent(d.value));
      return;
    }
  }

  if (document.location.hash) {
    qs = document.location.hash.slice(1);
    d = {};
    qs = qs.split('&');
    qs.forEach(function (kv) { kv = kv.split('='); d[kv[0]] = kv[1]; });

    if (d.access_token && d.id_token) {
      // show token-type selector
      $('.jwt-playground .selections .token-type').show();
    }

    if (d.id_token) {
      tokenEditor.setValue(decodeURIComponent(d.id_token));
      return;
    }

    if (d.access_token) {
      tokenEditor.setValue(decodeURIComponent(d.access_token));
      return;
    }
  }

  loadFromStorage(function (jwt) {
    lastRestoredToken = jwt ||  DEFAULT_RS_TOKEN|| DEFAULT_HS_TOKEN;

    tokenEditor.setValue(
      lastRestoredToken
    );
  });

}());


//TIMESTAMP
(function() {
  setInterval(function() {
    var now, timestamp;
    timestamp = new Date(1987, 5, 30);
    now = new Date();
    return $('#time').text(((now - timestamp) / 1000).toFixed(0));
  }, 1000);
}).call(this);

//Inizialize bootstrap widgets
$('[data-toggle="tooltip"]').tooltip();

// 07012015
$(".debugger-jwt .algorithm select").change(function() {
  $('.debugger-jwt .algorithm input[value="'+$(this).val()+'"]').parent().trigger("click");
  $('.debugger-jwt .algorithm input[value="'+$(this).val()+'"]').change();
});


$(".debugger-jwt .algorithm select").change(function(){var a=$('.debugger-jwt .algorithm input[value="'+$(this).val()+'"]');a.prop("checked",!0);});
// end 07012015

$(".debugger-jwt .token-type select").change(function() {
  $('.debugger-jwt .token-type input[value="'+$(this).val()+'"]').parent().trigger("click");
  $('.debugger-jwt .token-type input[value="'+$(this).val()+'"]').change();
});

$(".debugger-jwt .token-type select").change(function(){var a=$('.debugger-jwt .token-type input[value="'+$(this).val()+'"]');a.prop("checked",!0);});


// Fetch stargazers count for each repo from GitHub's API
$('.stars').each(function(idx, element){
  var $el = $(element);
  var repo = $el.attr('data-repo');

  function setCount(count) {
    var $count = $('<span>');

    $count.text(count);

    $el.find('i').after($count);

    $el.show();
  }

  if (repo){
    var repoKey = "stars_" + repo;
    if(!localStorage.getItem(repoKey)) {

      $.getJSON('https://api.github.com/repos/' + repo, function(repoData){
        var starCount = repoData.stargazers_count;
        safeLocalStorageSetItem(repoKey, starCount);
        setCount(starCount);
      });
    } else {
      setCount(localStorage.getItem(repoKey));
    }
  }
});
