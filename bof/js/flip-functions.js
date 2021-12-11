var siteW = $(window).width();
var siteH = $(window).height();

TweenMax.set(".container", { perspective: "1200px" }); 
TweenMax.set("#old-content", { transformOrigin: "100% 50%", backfaceVisibility: "hidden" });
TweenMax.set("#new-content", { transformOrigin: "0% 50%", backfaceVisibility: "hidden" });

var duration = 2.5;
var stay = 15.0;

var tlFlip = new TimelineMax({ yoyo: true, repeat: -1, delay: 1, repeatDelay: stay });

tlFlip
.to(".container", duration/2, { scale: 0.9, ease: Power2.easeInOut }, "start")
.to(".container", duration/2, { scale: 1, ease: Power2.easeInOut }, "start+=" + duration / 2)
.to("#old-content", duration, { x: -siteW, rotationY: -90, ease: Power2.easeInOut }, "start")
.fromTo("#new-content", duration, { x: siteW, rotationY: 90 }, { x: 0, rotationY: 0, ease: Power2.easeInOut }, "start")
/*
 * Old hack to hide backface of #old-content, but fixed with z-index halfways in
 * the animation .set('#old-content', { visibility: 'hidden' }, "start+=0.78")
 */
.set('#new-content', { zIndex: 2 }, "start+=" + duration / 2);
