/*-----------------------------------------------------------------------------------

Theme Name: Gerold - Personal Portfolio HTML5 Template
Theme URI: https://themejunction.net/html/gerold/demo/
Author: Theme-Junction
Author URI: https://themeforest.net/user/theme-junction
Description: Gerold - Personal Portfolio HTML5 Template

-----------------------------------------------------------------------------------

/***************************************************
==================== JS INDEX ======================
****************************************************
// Data js
// Sidebar Navigation
// Sticky Header
// Hamburger Menu
// Scroll To Section
// OnePage Active Class
// Portfolio Filter
// Portfolio Gallery Carousel
// Testimonial Carousel
// Nice Select
// ALL Popup
// Preloader
// Sidebar Hover BG Color
// Services Hover BG
// Portfolio Filter BG Color
// Funfact
// WoW Js

****************************************************/

(function ($) {
	"use strict";

	/*------------------------------------------------------
  /  Data js
  /------------------------------------------------------*/
	$("[data-bg-image]").each(function () {
		$(this).css(
			"background-image",
			"url(" + $(this).attr("data-bg-image") + ")"
		);
	});

	$("[data-bg-color]").each(function () {
		$(this).css("background-color", $(this).attr("data-bg-color"));
	});

	$(document).ready(function ($) {

		/*------------------------------------------------------
  	/  Sticky Header
  	/------------------------------------------------------*/
	var lastScrollTop = 0;
	$(window).scroll(function () {
		var scroll = $(window).scrollTop();

		if (scroll > 300) {
			$(".tj-header-area.header-sticky").addClass("sticky");
			$(".tj-header-area.header-sticky").removeClass("sticky-out");
		} else if (scroll < lastScrollTop) {
			if (scroll < 500) {
				$(".tj-header-area.header-sticky").addClass("sticky-out");
				$(".tj-header-area.header-sticky").removeClass("sticky");
			}
		} else {
			$(".tj-header-area.header-sticky").removeClass("sticky");
		}

		lastScrollTop = scroll;
	});
		

		/*------------------------------------------------------
  	/  Hamburger Menu
  	/------------------------------------------------------*/
		$(".menu-bar").on("click", function () {
			$(".menu-bar").toggleClass("menu-bar-toggeled");
			$(".header-menu").toggleClass("opened");
			$("body").toggleClass("overflow-hidden");
		});

		$(".header-menu ul li a").on("click", function () {
			$(".menu-bar").removeClass("menu-bar-toggeled");
			$(".header-menu").removeClass("opened");
			$("body").removeClass("overflow-hidden");
		});

		/*------------------------------------------------------
  	/  OnePage Active Class
  	/------------------------------------------------------*/
		function onPageNav(switchName) {
			const navSwitch = $(switchName);
			const deductHeight = 60;
			let navArr = [];

			navSwitch.each(function (i) {
				let navSwitchHref = $(this).attr("href");
				let tgtOff = $(navSwitchHref).offset().top - deductHeight;
				navArr.push([]);
				navArr[i].switch = $(this);
				navArr[i].tgtOff = tgtOff;
			});
			//        console.log(navArr);
			$(window).scroll(function () {
				for (let i = 0; i < navArr.length; i++) {
					let scroll = $(window).scrollTop();
					let tgtKey = navArr[i];
					let tgtSwitch = tgtKey.switch;
					let tgtOff = tgtKey.tgtOff;
					if (scroll >= tgtOff) {
						navSwitch.parent().removeClass("is-current");
						tgtSwitch.parent().addClass("is-current");
					} else {
						tgtSwitch.parent().removeClass("is-current");
					}
				}
			});
		}
		$(window).on("load resize", function () {
			onPageNav(".side-navbar a");
		});

		$(".header-menu nav ul").onePageNav({
			currentClass: "current-menu-ancestor",
			changeHash: false,
			easing: "swing",
		});

		/*------------------------------------------------------
  	/  Portfolio Filter
  	/------------------------------------------------------*/
		/*------------------------------------------------------
  /  Portfolio Filter
  /------------------------------------------------------*/

var $grid = $(".portfolio-box").isotope({
    masonry: {
        columnWidth: ".portfolio-box .portfolio-sizer",
        gutter: ".portfolio-box .gutter-sizer",
    },
    itemSelector: ".portfolio-box .portfolio-item",
    percentPosition: true,

    // Show every project by default
    filter: "*"
});

// Recalculate masonry after deferred images load or fail.
$grid.find("img").on("load error", function () {
    $grid.isotope("layout");
});

// Set the default active button.
$(".filter-button-group button").removeClass("active");
$('.filter-button-group button[data-filter="*"]').addClass("active");

// Mobile-only "Load More" for the All tab.
var portfolioMobileQuery = window.matchMedia("(max-width: 767px)");
var portfolioFilterValue = "*";
var portfolioBatchSize = 4;
var portfolioVisibleCount = portfolioBatchSize;
var $portfolioLoadMoreWrap = $(".portfolio-load-more-wrap");
var $portfolioLoadMoreBtn = $(".portfolio-load-more");

function getPortfolioMatchingItems() {
    var $items = $grid.find(".portfolio-item");
    return portfolioFilterValue === "*" ? $items : $items.filter(portfolioFilterValue);
}

function updatePortfolioLoadMore() {
    var $matching = getPortfolioMatchingItems();
    var shouldShow =
        portfolioMobileQuery.matches &&
        portfolioFilterValue === "*" &&
        portfolioVisibleCount < $matching.length;

    $portfolioLoadMoreWrap.toggleClass("is-visible", shouldShow);
}

function applyPortfolioFilter() {
    var $matching = getPortfolioMatchingItems();
    var limit =
        portfolioMobileQuery.matches && portfolioFilterValue === "*"
            ? Math.min(portfolioVisibleCount, $matching.length)
            : $matching.length;
    var visibleItems = $matching.slice(0, limit).get();

    $grid.isotope({
        filter: function () {
            return visibleItems.indexOf(this) !== -1;
        },
    });

    updatePortfolioLoadMore();
}

function centerPortfolioFilterButton(button) {
    var group = button.parentNode;
    if (!group || group.scrollWidth <= group.clientWidth) {
        return;
    }
    var target = button.offsetLeft - (group.clientWidth - button.offsetWidth) / 2;
    target = Math.max(0, Math.min(target, group.scrollWidth - group.clientWidth));

    if (group.scrollTo) {
        group.scrollTo({ left: target, behavior: "smooth" });
    } else {
        group.scrollLeft = target;
    }
}

// filter items on button click
$(".filter-button-group").on("click", "button", function () {
    $(".filter-button-group button").removeClass("active");
    $(this).addClass("active");

    portfolioFilterValue = $(this).attr("data-filter") || "*";
    if (portfolioFilterValue === "*") {
        portfolioVisibleCount = portfolioBatchSize;
    }

    applyPortfolioFilter();

    if (portfolioMobileQuery.matches) {
        centerPortfolioFilterButton(this);
    }
});

$portfolioLoadMoreBtn.on("click", function () {
    portfolioVisibleCount += portfolioBatchSize;
    applyPortfolioFilter();
});

var portfolioWasMobile = portfolioMobileQuery.matches;
var handlePortfolioBreakpointChange = function () {
    if (portfolioMobileQuery.matches === portfolioWasMobile) {
        return;
    }
    portfolioWasMobile = portfolioMobileQuery.matches;
    portfolioVisibleCount = portfolioBatchSize;
    applyPortfolioFilter();
};

if (portfolioMobileQuery.addEventListener) {
    portfolioMobileQuery.addEventListener("change", handlePortfolioBreakpointChange);
} else if (portfolioMobileQuery.addListener) {
    portfolioMobileQuery.addListener(handlePortfolioBreakpointChange);
}

applyPortfolioFilter();

		/*------------------------------------------------------
  	/  Portfolio Gallery Carousel
  	/------------------------------------------------------*/
		$(".portfolio_gallery.owl-carousel").owlCarousel({
			items: 2,
			loop: true,
			lazyLoad: true,
			center: true,
			// autoWidth: true,
			autoplayHoverPause: true,
			autoplay: false,
			autoplayTimeout: 5000,
			smartSpeed: 800,
			margin: 30,
			nav: false,
			dots: true,
			responsive: {
				// breakpoint from 0 up
				0: {
					items: 1,
					margin: 0,
				},
				// breakpoint from 768 up
				768: {
					items: 2,
					margin: 20,
				},
				992: {
					items: 2,
					margin: 30,
				},
			},
		});

		/*------------------------------------------------------
  	/ Testimonial Carousel
  	/------------------------------------------------------*/
		$(".testimonial-carousel.owl-carousel").owlCarousel({
			loop: true,
			margin: 30,
			nav: false,
			dots: true,
			autoplay: false,
			active: true,
			smartSpeed: 1000,
			autoplayTimeout: 7000,
			responsive: {
				0: {
					items: 1,
				},
				600: {
					items: 2,
				},
				1000: {
					items: 2,
				},
				1200: {
					items: 3,
				},
			},
		});

		/*------------------------------------------------------
  	/ Post Gallery Carousel
  	/------------------------------------------------------*/
		$(".tj-post__gallery.owl-carousel").owlCarousel({
			items: 1,
			loop: true,
			margin: 30,
			dots: false,
			nav: true,
			navText: [
				'<i class="fal fa-arrow-left"></i>',
				'<i class="fal fa-arrow-right"></i>',
			],
			autoplay: false,
			smartSpeed: 1000,
			autoplayTimeout: 3000,
		});

		/*------------------------------------------------------
  	/  Nice Select
  	/------------------------------------------------------*/
		$("select").niceSelect();

		/*------------------------------------------------------
  	/  ALL Popup
  	/------------------------------------------------------*/
		if ($(".popup_video").length > 0) {
			$(`.popup_video`).lightcase({
				transition: "elastic",
				showSequenceInfo: false,
				slideshow: false,
				swipe: true,
				showTitle: false,
				showCaption: false,
				controls: true,
			});
		}

		$(".modal-popup").magnificPopup({
			type: "inline",
			fixedContentPos: false,
			fixedBgPos: true,
			overflowY: "auto",
			closeBtnInside: true,
			preloader: false,
			midClick: true,
			removalDelay: 300,
			mainClass: "popup-mfp",
		});
	});

	$(function () {
		/*------------------------------------------------------
  	/  WoW Js
  	/------------------------------------------------------*/
		var wow = new WOW({
			boxClass: "wow", // default
			animateClass: "animated", // default
			offset: 100, // default
			mobile: true, // default
			live: true, // default
		});
		wow.init();

		/*------------------------------------------------------
  	/  Preloader
  	/------------------------------------------------------*/
		// Reveal content as soon as the DOM is ready, without waiting for images.
		$(".preloader").remove();

		/*------------------------------------------------------
  	/  Sidebar Hover BG Color
  	/------------------------------------------------------*/
		if ($(".side-navbar").length > 0) {
			function sidebar_animation() {
				var active_bg = $(".side-navbar ul .active-bg");

				$(".side-navbar ul li").on("mouseenter", function () {
					var element = $(this);
					activeSidebar(active_bg, element);
				});

				$(".side-navbar ul").on("mouseleave", function () {
					var element = $(".side-navbar ul li.is-current");
					activeSidebar(active_bg, element);
					element.closest("li").siblings().removeClass("mleave");
				});

				// Use MutationObserver to detect changes in the is-current class
				var observer = new MutationObserver(function (mutations) {
					mutations.forEach(function (mutation) {
						if (
							mutation.attributeName === "class" &&
							mutation.target.classList.contains("is-current")
						) {
							var element = $(".side-navbar ul li.is-current");
							activeSidebar(active_bg, element);
						}
					});
				});

				observer.observe(document.querySelector(".side-navbar ul"), {
					attributes: true,
					subtree: true,
				});

				// Initial setup
				var initialElement = $(".side-navbar ul li.is-current");
				activeSidebar(active_bg, initialElement);
			}

			sidebar_animation();

			function activeSidebar(active_bg, e) {
				if (!e.length) {
					return false;
				}
				var topOff = e.offset().top;
				var height = e.outerHeight();
				var menuTop = $(".side-navbar ul").offset().top;
				e.closest("li").removeClass("mleave");
				e.closest("li").siblings().addClass("mleave");
				active_bg.css({ top: topOff - menuTop + "px", height: height + "px" });
			}
		}

		/*------------------------------------------------------
  	/  Services Hover BG
  	/------------------------------------------------------*/
		function service_animation() {
			var active_bg = $(".services-widget .active-bg");
			var element = $(".services-widget .current");
			$(".services-widget .service-item").on("mouseenter", function () {
				var e = $(this);
				activeService(active_bg, e);
			});
			$(".services-widget").on("mouseleave", function () {
				element = $(".services-widget .current");
				activeService(active_bg, element);
				element.closest(".service-item").siblings().removeClass("mleave");
			});
			activeService(active_bg, element);
		}
		service_animation();

		function activeService(active_bg, e) {
			if (!e.length) {
				return false;
			}
			var topOff = e.offset().top;
			var height = e.outerHeight();
			var menuTop = $(".services-widget").offset().top;
			e.closest(".service-item").removeClass("mleave");
			e.closest(".service-item").siblings().addClass("mleave");
			active_bg.css({ top: topOff - menuTop + "px", height: height + "px" });
		}

		$(".services-widget .service-item").on("click", function () {
			$(".services-widget .service-item").removeClass("current");
			$(this).addClass("current");
		});

		/*------------------------------------------------------
  	/  Portfolio Filter BG Color
  	/------------------------------------------------------*/
		function filter_animation() {
			var active_bg = $(".portfolio-filter .button-group .active-bg");
			var element = $(".portfolio-filter .button-group .active");
			$(".portfolio-filter .button-group button").on("click", function () {
				var e = $(this);
				activeFilterBtn(active_bg, e);
			});
			activeFilterBtn(active_bg, element);
		}
		filter_animation();

		function activeFilterBtn(active_bg, e) {
			if (!e.length) {
				return false;
			}
			var leftOff = e.offset().left;
			var width = e.outerWidth();
			var menuLeft = $(".portfolio-filter .button-group").offset().left;
			e.addClass("active").siblings("button").removeClass("active");
			active_bg.css({ left: leftOff - menuLeft + "px", width: width + "px" });
		}

		/*------------------------------------------------------
  	/  Funfact
  	/------------------------------------------------------*/
		if ($(".odometer").length > 0) {
			$(".odometer").appear(function () {
				var odo = $(".odometer");
				odo.each(function () {
					var countNumber = $(this).attr("data-count");
					$(this).html(countNumber);
				});
			});
		}
	});
})(jQuery);
