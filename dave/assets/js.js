(function() {
var isIframed;
try { isIframed = window.self !== window.top; } catch(e) { isIframed = true; }

var utmSource = '';
var utmMedium = '';

try {
	if (isIframed && document.referrer) {
		utmSource = new URL(document.referrer).hostname;
	} else {
		utmSource = window.location.hostname;
	}
} catch(e) {
	utmSource = isIframed ? (document.referrer || 'unknown') : window.location.hostname;
}

try {
	utmMedium = window.location.href;
} catch(e) {
	utmMedium = 'unknown';
}

function isKbhHost(h) {
	return !!h && (h === 'kbhgames.com' || h.slice(-13) === '.kbhgames.com');
}

var isKbh = false;
try {
	var ao = window.location.ancestorOrigins;
	if (ao && ao.length) {
		for (var i = 0; i < ao.length; i++) {
			try {
				if (isKbhHost(new URL(ao[i]).hostname)) { isKbh = true; break; }
			} catch(e) {}
		}
	}
	if (!isKbh && isIframed && document.referrer) {
		try { isKbh = isKbhHost(new URL(document.referrer).hostname); } catch(e) {}
	}
	if (!isKbh) {
		isKbh = isKbhHost(window.location.hostname);
	}
} catch(e) {}

if (isKbh) return;

var baseLink = 'https://kbhgames.com/tag/friday-night-funkin';
var trackedLink = baseLink + '?ref=' + encodeURIComponent(utmSource) + '&via=' + encodeURIComponent(utmMedium);

var atTop = Math.random() >= 0.5;
var BAR = 29;
var borderCss = atTop ? 'border-bottom:1px solid #222;' : 'border-top:1px solid #222;';

var bannerStyle = 'style="position:relative;display:flex;align-items:center;justify-content:flex-end;width:100%;height:' + BAR + 'px;flex:0 0 ' + BAR + 'px;padding-right:40px;background:#111;' + borderCss + 'box-sizing:border-box;"';
var linkStyle = 'style="color:rgba(255,165,0,0.75);text-decoration:none;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Arial,sans-serif;font-size:15px;font-weight:700;letter-spacing:1px;text-transform:uppercase;display:flex;align-items:center;gap:5px;transition:color 0.2s;cursor:pointer;"';
var dotSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="3" height="3" viewBox="0 0 3 3"><circle cx="1.5" cy="1.5" r="1.5" fill="rgba(255,165,0,0.5)"/></svg>';
var arrowSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M4 11h12.17l-5.59-5.59L12 4l8 8-8 8-1.41-1.41L16.17 13H4z"/></svg>';
var bannerHTML = '<div id="playmore" ' + bannerStyle + '>' +
	'<a href="' + trackedLink + '" target="_blank" ' + linkStyle + ' onmouseover="this.style.color=\'#ffa500\'" onmouseout="this.style.color=\'rgba(255,165,0,0.75)\'">' +
	dotSvg + ' Play More Games ' + arrowSvg +
	'</a></div>';

function findContainer() {
	var ids = ['openfl-content', 'lime-content', 'haxe-content', 'game-container'];
	for (var i = 0; i < ids.length; i++) {
		var el = document.getElementById(ids[i]);
		if (el) return el;
	}
	var canvas = document.querySelector('canvas');
	if (!canvas) return null;
	var p = canvas.parentElement;
	return (p && p !== document.body && p !== document.documentElement) ? p : canvas;
}

function applyLayout(el) {
	if (!document.body) return;
	var b = document.body.style;
	b.margin = '0';
	b.padding = '0';
	b.display = 'flex';
	b.flexDirection = 'column';
	b.width = '100vw';
	b.height = '100vh';
	b.height = '100dvh';
	b.overflow = 'hidden';
	var h = document.documentElement && document.documentElement.style;
	if (h) { h.margin = '0'; h.padding = '0'; }
	if (!el) return;
	var s = el.style;
	s.position = 'relative';
	s.flex = '1 1 auto';
	s.minHeight = '0';
	s.minWidth = '0';
	s.width = '100%';
	s.height = 'auto';
	s.top = 'auto';
	s.bottom = 'auto';
	s.left = 'auto';
	s.right = 'auto';
	s.margin = '0';
	s.maxHeight = 'none';
	if (el.tagName === 'CANVAS') {
		s.width = '100%';
		s.height = '100%';
		s.display = 'block';
	}
}

function inject() {
	if (!document.body) return false;
	if (!document.getElementById('playmore')) {
		document.body.insertAdjacentHTML(atTop ? 'afterbegin' : 'beforeend', bannerHTML);
	}
	applyLayout(findContainer());
	try { window.dispatchEvent(new Event('resize')); } catch(e) {}
	return true;
}

var resizeQueued = false;
function onResize() {
	if (resizeQueued) return;
	resizeQueued = true;
	(window.requestAnimationFrame || function(cb){ return setTimeout(cb, 16); })(function() {
		resizeQueued = false;
		applyLayout(findContainer());
	});
}

if (document.body) {
	inject();
} else if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', inject, false);
} else {
	window.addEventListener('load', inject, false);
}

window.addEventListener('load', function() {
	if (!document.getElementById('playmore')) inject();
	else applyLayout(findContainer());
}, false);

window.addEventListener('resize', onResize, false);
window.addEventListener('orientationchange', onResize, false);

})();

window.addEventListener('load', function () {
	window.focus();
	document.body.addEventListener('click', function(e) {
		window.focus();
	}, false);
});
window.addEventListener("keydown", function(e) {
	if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
		e.preventDefault();
	}
}, false);
