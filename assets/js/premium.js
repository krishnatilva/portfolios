/* ==========================================================================
   PREMIUM LAYER — Krishna Tilva Portfolio
   Vanilla JS enhancement engine (runs after main.js)
   ========================================================================== */
(function () {
	"use strict";

	var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
	var root = document.documentElement;

	/* ----------------------------------------------------------------------
	   Preloader
	   ---------------------------------------------------------------------- */
	function hidePreloader() {
		var pre = document.querySelector(".preloader");
		if (!pre) return;
		pre.classList.add("is-done");
		window.setTimeout(function () {
			if (pre.parentNode) pre.parentNode.removeChild(pre);
		}, 800);
	}

	if (document.readyState === "complete") {
		hidePreloader();
	} else {
		window.addEventListener("load", hidePreloader);
	}
	window.setTimeout(hidePreloader, 2400);

	/* ----------------------------------------------------------------------
	   Scroll progress bar
	   ---------------------------------------------------------------------- */
	var progressBar = document.querySelector("#scrollProgress");
	if (progressBar) {
		var updateProgress = function () {
			var doc = document.documentElement;
			var scrollable = doc.scrollHeight - window.innerHeight;
			var ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
			progressBar.style.transform = "scaleX(" + Math.min(ratio, 1) + ")";
		};
		window.addEventListener("scroll", updateProgress, { passive: true });
		window.addEventListener("resize", updateProgress);
		updateProgress();
	}

	/* ----------------------------------------------------------------------
	   Mobile side drawer (left to right)
	   ---------------------------------------------------------------------- */
	var drawer = document.querySelector("#mobileDrawer");
	if (drawer) {
		var openDrawer = function () {
			drawer.classList.add("is-open");
			drawer.setAttribute("aria-hidden", "false");
			document.body.classList.add("drawer-open", "overflow-hidden");
		};

		var closeDrawer = function () {
			drawer.classList.remove("is-open");
			drawer.setAttribute("aria-hidden", "true");
			document.body.classList.remove("drawer-open", "overflow-hidden");
			document.querySelectorAll(".menu-bar").forEach(function (bar) {
				bar.classList.remove("menu-bar-toggeled");
			});
			document.querySelectorAll(".header-menu").forEach(function (menu) {
				menu.classList.remove("opened");
			});
		};

		document.querySelectorAll(".menu-bar").forEach(function (bar) {
			bar.addEventListener("click", function () {
				window.setTimeout(openDrawer, 0);
			});
		});

		drawer.querySelector(".drawer-close").addEventListener("click", closeDrawer);
		drawer.addEventListener("click", function (e) {
			if (!e.target.closest(".drawer-panel")) closeDrawer();
		});
		drawer.querySelectorAll(".drawer-nav a, .drawer-foot a").forEach(function (link) {
			link.addEventListener("click", closeDrawer);
		});
		document.addEventListener("keydown", function (e) {
			if (e.key === "Escape" && drawer.classList.contains("is-open")) closeDrawer();
		});

		// Highlight the section currently in view
		var drawerLinks = drawer.querySelectorAll(".drawer-nav a");
		var drawerSections = [];
		drawerLinks.forEach(function (link) {
			var target = document.querySelector(link.getAttribute("href"));
			if (target) drawerSections.push({ link: link, target: target });
		});
		if ("IntersectionObserver" in window) {
			var drawerSpy = new IntersectionObserver(
				function (entries) {
					entries.forEach(function (entry) {
						if (!entry.isIntersecting) return;
						drawerLinks.forEach(function (link) {
							link.classList.remove("is-active");
						});
						drawerSections.forEach(function (item) {
							if (item.target === entry.target) item.link.classList.add("is-active");
						});
					});
				},
				{ rootMargin: "-45% 0px -50% 0px" }
			);
			drawerSections.forEach(function (item) {
				drawerSpy.observe(item.target);
			});
		}
	}

	/* ----------------------------------------------------------------------
	   Counter numbers (hero stats)
	   ---------------------------------------------------------------------- */
	document.querySelectorAll(".funfact-area .count").forEach(function (el) {
		var target = parseInt(el.getAttribute("data-count"), 10) || 0;
		var started = false;

		function run() {
			if (started) return;
			started = true;
			if (reduceMotion) {
				el.textContent = target;
				return;
			}
			var startTime = null;
			var duration = 1500;
			function step(ts) {
				if (!startTime) startTime = ts;
				var p = Math.min((ts - startTime) / duration, 1);
				var eased = 1 - Math.pow(1 - p, 3);
				el.textContent = Math.round(target * eased);
				if (p < 1) window.requestAnimationFrame(step);
				else el.textContent = target;
			}
			window.requestAnimationFrame(step);
		}

		if ("IntersectionObserver" in window) {
			var countObserver = new IntersectionObserver(
				function (entries) {
					entries.forEach(function (entry) {
						if (entry.isIntersecting) {
							run();
							countObserver.unobserve(entry.target);
						}
					});
				},
				{ threshold: 0.4 }
			);
			countObserver.observe(el);
		} else {
			run();
		}
	});

	/* ----------------------------------------------------------------------
	   Scroll reveal
	   ---------------------------------------------------------------------- */
	var revealEls = document.querySelectorAll("[data-reveal]");
	if (revealEls.length) {
		if ("IntersectionObserver" in window && !reduceMotion) {
			var revealObserver = new IntersectionObserver(
				function (entries) {
					entries.forEach(function (entry) {
						if (entry.isIntersecting) {
							entry.target.classList.add("is-visible");
							revealObserver.unobserve(entry.target);
						}
					});
				},
				{ threshold: 0.12, rootMargin: "0px 0px -50px 0px" }
			);
			revealEls.forEach(function (el) {
				revealObserver.observe(el);
			});
		} else {
			revealEls.forEach(function (el) {
				el.classList.add("is-visible");
			});
		}
	}

	// Auto-stagger children of [data-stagger]
	document.querySelectorAll("[data-stagger]").forEach(function (parent) {
		var step = parseFloat(parent.getAttribute("data-stagger")) || 90;
		Array.prototype.forEach.call(parent.children, function (child, i) {
			child.style.setProperty("--d", (i * step) / 1000 + "s");
		});
	});

	/* ----------------------------------------------------------------------
	   Skill bars
	   ---------------------------------------------------------------------- */
	var skillItems = document.querySelectorAll(".skills-widget .skill-item");
	if (skillItems.length) {
		skillItems.forEach(function (item) {
			var numEl = item.querySelector(".number");
			var inner = item.querySelector(".skill-inner");
			if (!numEl || !inner) return;
			var value = parseInt(String(numEl.textContent).replace(/[^\d]/g, ""), 10);
			if (isNaN(value)) value = 0;

			var bar = document.createElement("span");
			bar.className = "skill-bar";
			bar.innerHTML = "<i></i>";
			bar.style.setProperty("--p", Math.min(value, 100) + "%");
			inner.appendChild(bar);
		});

		if ("IntersectionObserver" in window && !reduceMotion) {
			var skillObserver = new IntersectionObserver(
				function (entries) {
					entries.forEach(function (entry) {
						if (entry.isIntersecting) {
							entry.target.classList.add("is-revealed");
							skillObserver.unobserve(entry.target);
						}
					});
				},
				{ threshold: 0.4 }
			);
			skillItems.forEach(function (item) {
				skillObserver.observe(item);
			});
		} else {
			skillItems.forEach(function (item) {
				item.classList.add("is-revealed");
			});
		}
	}

	/* ----------------------------------------------------------------------
	   Image fallbacks (external icons/avatars)
	   ---------------------------------------------------------------------- */
	var fallbackMap = {
		WordPress: "WP",
		Shopify: "SH",
		BigCommerce: "BC",
		WooCommerce: "WC",
		"Elementor Pro": "EL",
		"Elementor": "EL",
		"Divi Builder": "DV",
		"Divi": "DV",
		WPBakery: "WB",
		Figma: "FG",
		"HTML CSS JavaScript": "</>",
		"HTML • CSS • JS": "</>",
		"Automation": "AI",
		"AI & Automation": "AI"
	};

	function applySkillFallback(img) {
		if (img.dataset.fallbackDone) return;
		img.dataset.fallbackDone = "1";
		var label = fallbackMap[img.alt] || (img.alt || "•").slice(0, 2).toUpperCase();
		var span = document.createElement("span");
		span.className = "skill-fallback";
		span.textContent = label;
		if (img.parentNode) img.parentNode.replaceChild(span, img);
	}

	document.querySelectorAll(".skills-widget .skill-item img").forEach(function (img) {
		img.addEventListener("error", function () {
			applySkillFallback(img);
		});
		if (img.complete && img.naturalWidth === 0) applySkillFallback(img);
	});

	function applyAvatarFallback(img) {
		if (img.dataset.fallbackDone) return;
		img.dataset.fallbackDone = "1";
		var item = img.closest(".testimonial-item");
		var name = item ? item.querySelector(".name") : null;
		var initials = name
			? name.textContent
					.trim()
					.split(/\s+/)
					.map(function (w) {
						return w.charAt(0);
					})
					.join("")
					.slice(0, 2)
			: "KT";
		var span = document.createElement("span");
		span.className = "avatar-fallback";
		span.textContent = initials;
		if (img.parentNode) img.parentNode.replaceChild(span, img);
	}

	document.querySelectorAll(".testimonial-item .image-box img").forEach(function (img) {
		img.addEventListener("error", function () {
			applyAvatarFallback(img);
		});
		if (img.complete && img.naturalWidth === 0) applyAvatarFallback(img);
	});

	/* ----------------------------------------------------------------------
	   Portfolio card decorations (category pill, open icon, arrow)
	   ---------------------------------------------------------------------- */
	document.querySelectorAll(".portfolio-box .portfolio-item").forEach(function (item) {
		var imgBox = item.querySelector(".image-box");
		var content = item.querySelector(".content-box");
		if (!imgBox) return;

		var label = "Project";
		var icon = "fa-solid fa-layer-group";

		if (item.classList.contains("shopify")) {
			label = "Shopify";
			icon = "fa-solid fa-bag-shopping";
		} else if (item.classList.contains("wordpress")) {
			label = "WordPress";
			icon = "fa-brands fa-wordpress";
		} else if (item.classList.contains("landingpage")) {
			label = "Landing Page";
			icon = "fa-solid fa-rocket";
		} else if (item.classList.contains("themes")) {
			label = "Theme";
			icon = "fa-solid fa-palette";
		}

		if (!imgBox.querySelector(".project-cat")) {
			var cat = document.createElement("span");
			cat.className = "project-cat";
			cat.innerHTML = '<i class="' + icon + '"></i> ' + label;
			imgBox.appendChild(cat);

			var open = document.createElement("span");
			open.className = "project-open";
			open.innerHTML = '<i class="fa-solid fa-arrow-up-right"></i>';
			imgBox.appendChild(open);
		}

		if (content && !content.querySelector("i")) {
			var arrow = document.createElement("i");
			arrow.className = "fa-solid fa-arrow-right";
			content.appendChild(arrow);
		}
	});

	/* ----------------------------------------------------------------------
	   Testimonial star ratings
	   ---------------------------------------------------------------------- */
	document.querySelectorAll(".testimonial-item").forEach(function (item) {
		var quote = item.querySelector(".quote");
		if (!quote || item.querySelector(".testimonial-stars")) return;
		var stars = document.createElement("div");
		stars.className = "testimonial-stars";
		stars.innerHTML = new Array(6).join('<i class="fa-solid fa-star"></i>');
		item.insertBefore(stars, quote);
	});

	/* ----------------------------------------------------------------------
	   Spotlight on cards
	   ---------------------------------------------------------------------- */
	document.querySelectorAll(".process-card, .blog-item, .about-feature").forEach(function (el) {
		el.classList.add("spotlight");
	});

	/* ----------------------------------------------------------------------
	   Marquee duplication
	   ---------------------------------------------------------------------- */
	document.querySelectorAll(".marquee-track").forEach(function (track) {
		var group = track.querySelector(".marquee-group");
		if (group && !track.dataset.cloned) {
			track.dataset.cloned = "1";
			track.appendChild(group.cloneNode(true));
		}
	});

	/* ----------------------------------------------------------------------
	   Typewriter
	   ---------------------------------------------------------------------- */
	document.querySelectorAll("[data-type]").forEach(function (el) {
		var words = (el.getAttribute("data-type") || "")
			.split("|")
			.map(function (w) {
				return w.trim();
			})
			.filter(Boolean);
		if (!words.length) return;

		if (reduceMotion) {
			el.textContent = words[0];
			return;
		}

		var wordIndex = 0;
		var charIndex = 0;
		var deleting = false;

		function tick() {
			var word = words[wordIndex];
			charIndex += deleting ? -1 : 1;
			el.textContent = word.slice(0, charIndex);

			var delay = deleting ? 45 : 85;

			if (!deleting && charIndex === word.length) {
				deleting = true;
				delay = 1700;
			} else if (deleting && charIndex === 0) {
				deleting = false;
				wordIndex = (wordIndex + 1) % words.length;
				delay = 350;
			}

			window.setTimeout(tick, delay);
		}

		tick();
	});

	/* ----------------------------------------------------------------------
	   Tilt effect
	   ---------------------------------------------------------------------- */
	if (finePointer && !reduceMotion) {
		document.querySelectorAll("[data-tilt]").forEach(function (el) {
			var max = parseFloat(el.getAttribute("data-tilt")) || 6;

			el.addEventListener("mousemove", function (e) {
				var rect = el.getBoundingClientRect();
				var px = (e.clientX - rect.left) / rect.width - 0.5;
				var py = (e.clientY - rect.top) / rect.height - 0.5;
				el.style.transform =
					"perspective(1000px) rotateX(" +
					(-py * max).toFixed(2) +
					"deg) rotateY(" +
					(px * max).toFixed(2) +
					"deg)";
			});

			el.addEventListener("mouseleave", function () {
				el.style.transform = "perspective(1000px) rotateX(0) rotateY(0)";
			});
		});

		// Magnetic buttons
		document.querySelectorAll("[data-magnetic]").forEach(function (el) {
			el.addEventListener("mousemove", function (e) {
				var rect = el.getBoundingClientRect();
				var dx = e.clientX - (rect.left + rect.width / 2);
				var dy = e.clientY - (rect.top + rect.height / 2);
				el.style.transform =
					"translate(" + dx * 0.18 + "px, " + dy * 0.22 + "px)";
			});
			el.addEventListener("mouseleave", function () {
				el.style.transform = "";
			});
		});
	}

	/* ----------------------------------------------------------------------
	   Spotlight cards
	   ---------------------------------------------------------------------- */
	if (finePointer) {
		document.querySelectorAll(".spotlight").forEach(function (card) {
			card.addEventListener("mousemove", function (e) {
				var rect = card.getBoundingClientRect();
				card.style.setProperty("--mx", e.clientX - rect.left + "px");
				card.style.setProperty("--my", e.clientY - rect.top + "px");
			});
		});
	}

	/* ----------------------------------------------------------------------
	   Hero particle network
	   ---------------------------------------------------------------------- */
	var canvas = document.querySelector("#heroCanvas");
	if (canvas && !reduceMotion) {
		var ctx = canvas.getContext("2d");
		var particles = [];
		var dpr = Math.min(window.devicePixelRatio || 1, 2);
		var running = false;
		var rafId = null;

		var resize = function () {
			var rect = canvas.getBoundingClientRect();
			canvas.width = Math.floor(rect.width * dpr);
			canvas.height = Math.floor(rect.height * dpr);
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

			var count = Math.min(58, Math.max(18, Math.round(rect.width / 26)));
			particles = [];
			for (var i = 0; i < count; i++) {
				particles.push({
					x: Math.random() * rect.width,
					y: Math.random() * rect.height,
					vx: (Math.random() - 0.5) * 0.35,
					vy: (Math.random() - 0.5) * 0.35,
					r: Math.random() * 1.6 + 0.7
				});
			}
		};

		var draw = function () {
			var rect = canvas.getBoundingClientRect();
			ctx.clearRect(0, 0, rect.width, rect.height);

			for (var i = 0; i < particles.length; i++) {
				var p = particles[i];
				p.x += p.vx;
				p.y += p.vy;

				if (p.x < 0 || p.x > rect.width) p.vx *= -1;
				if (p.y < 0 || p.y > rect.height) p.vy *= -1;

				ctx.beginPath();
				ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
				ctx.fillStyle = "rgba(185, 140, 255, 0.55)";
				ctx.fill();

				for (var j = i + 1; j < particles.length; j++) {
					var q = particles[j];
					var dx = p.x - q.x;
					var dy = p.y - q.y;
					var dist = Math.sqrt(dx * dx + dy * dy);

					if (dist < 125) {
						ctx.beginPath();
						ctx.moveTo(p.x, p.y);
						ctx.lineTo(q.x, q.y);
						ctx.strokeStyle = "rgba(135, 80, 247, " + (0.16 * (1 - dist / 125)).toFixed(3) + ")";
						ctx.lineWidth = 1;
						ctx.stroke();
					}
				}
			}

			rafId = window.requestAnimationFrame(draw);
		};

		var start = function () {
			if (running) return;
			running = true;
			draw();
		};

		var stop = function () {
			running = false;
			if (rafId) window.cancelAnimationFrame(rafId);
			rafId = null;
		};

		resize();
		start();
		window.addEventListener("resize", resize);

		if ("IntersectionObserver" in window) {
			new IntersectionObserver(
				function (entries) {
					entries.forEach(function (entry) {
						if (entry.isIntersecting) start();
						else stop();
					});
				},
				{ threshold: 0 }
			).observe(canvas);
		}

		document.addEventListener("visibilitychange", function () {
			if (document.hidden) stop();
			else start();
		});
	}

	/* ----------------------------------------------------------------------
	   Contact form -> mailto
	   ---------------------------------------------------------------------- */
	var toast = null;
	function showToast(message) {
		if (!toast) {
			toast = document.createElement("div");
			toast.className = "p-toast";
			document.body.appendChild(toast);
		}
		toast.textContent = message;
		toast.classList.add("is-visible");
		window.clearTimeout(toast._timer);
		toast._timer = window.setTimeout(function () {
			toast.classList.remove("is-visible");
		}, 4200);
	}

	document.querySelectorAll("form[data-mailto]").forEach(function (form) {
		form.addEventListener("submit", function (e) {
			e.preventDefault();

			var get = function (name) {
				var field = form.querySelector('[name="' + name + '"]');
				return field ? field.value.trim() : "";
			};

			var first = get("fname");
			var last = get("lname");
			var email = get("email");
			var phone = get("phone");
			var service = get("service");
			var message = get("message");

			if (!first || !email || !message) {
				showToast("Please add your name, email and a short project message.");
				return;
			}

			var to = form.getAttribute("data-mailto");
			var subject = "Project Inquiry — " + (service || "New project");
			var body =
				"Hi Krishna,\n\n" +
				message +
				"\n\n— Name: " +
				first +
				" " +
				last +
				"\n— Email: " +
				email +
				(phone ? "\n— Phone: " + phone : "") +
				(service ? "\n— Service: " + service : "");

			showToast("Opening your email app — talk soon!");
			window.setTimeout(function () {
				window.location.href =
					"mailto:" +
					to +
					"?subject=" +
					encodeURIComponent(subject) +
					"&body=" +
					encodeURIComponent(body);
			}, 350);
		});
	});

	/* ----------------------------------------------------------------------
	   Footer year
	   ---------------------------------------------------------------------- */
	document.querySelectorAll("[data-year]").forEach(function (el) {
		el.textContent = new Date().getFullYear();
	});

	/* ----------------------------------------------------------------------
	   Re-layout isotope after images decode (porfolio boxes)
	   ---------------------------------------------------------------------- */
	window.addEventListener("load", function () {
		if (window.jQuery && window.jQuery(".portfolio-box").length) {
			window.setTimeout(function () {
				window.jQuery(".portfolio-box").isotope("layout");
			}, 250);
		}
	});
})();
