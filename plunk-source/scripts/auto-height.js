function _resizeIframe(id) {
  var iframe = document.getElementById(id);
  try {
    var b_height = iframe.contentWindow.document.body.scrollHeight,
    d_height = iframe.contentWindow.document.documentElement.scrollHeight,
    height = Math.min(b_height, d_height);

    console.log('height', height);
    iframe.style.height = height + 'px';
  }
  catch(e) {}
  setTimeout(function () {
    _resizeIframe(id);
  }, 100);
}
_resizeIframe('test');
