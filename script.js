document.addEventListener('DOMContentLoaded', function(){
	// Mobile nav toggle
	const nav = document.getElementById('nav');
	const navToggle = document.getElementById('navToggle');
	navToggle.addEventListener('click', ()=>{
		nav.classList.toggle('show');
		const open = nav.classList.contains('show');
		navToggle.setAttribute('aria-expanded', open);
	});

	// Smooth scrolling for internal links
	document.querySelectorAll('a[href^="#"]').forEach(link=>{
		link.addEventListener('click', (e)=>{
			const targetId = link.getAttribute('href').slice(1);
			const target = document.getElementById(targetId);
			if(target){
				e.preventDefault();
				nav.classList.remove('show');
				target.scrollIntoView({behavior:'smooth',block:'start'});
			}
		});
	});

	// Section reveal, nav highlight, and item slide-in
	const sections = Array.from(document.querySelectorAll('main section'));
	const revealItems = Array.from(document.querySelectorAll('.reveal-item'));
	const navLinks = Array.from(document.querySelectorAll('.nav a'));

	function updateSectionState(entries){
		entries.forEach(entry=>{
			if(entry.isIntersecting){
				entry.target.classList.add('visible');
				if(entry.target.tagName.toLowerCase() === 'section'){
					const id = entry.target.id;
					navLinks.forEach(link=>{
						link.classList.toggle('active', link.getAttribute('href') === '#'+id);
					});
				}
			}
		});
	}

	const observer = new IntersectionObserver(updateSectionState,{threshold:0.18});
	sections.forEach(section=>observer.observe(section));
	revealItems.forEach(item=>observer.observe(item));

	const featureCards = Array.from(document.querySelectorAll('.feature'));
	featureCards.forEach(card=>{
		const toggle = card.querySelector('.feature-toggle');
		const detail = card.querySelector('.feature-detail');
		toggle?.addEventListener('click', ()=>{
			const isOpen = card.classList.toggle('open');
			detail.hidden = !isOpen;
			toggle.setAttribute('aria-expanded', isOpen);
		});
	});

	// Back-to-top
	const back = document.getElementById('backToTop');
	window.addEventListener('scroll', ()=>{
		if(window.scrollY > 300) back.style.display = 'block';
		else back.style.display = 'none';
	});
	back.addEventListener('click', ()=>window.scrollTo({top:0,behavior:'smooth'}));

	// Gallery / Lightbox
	const gallery = document.getElementById('gallery');
	const lightbox = document.getElementById('lightbox');
	const lbImage = document.getElementById('lbImage');
	const lbClose = document.getElementById('lbClose');
	const lbPrev = document.getElementById('lbPrev');
	const lbNext = document.getElementById('lbNext');
	let imgs = [];
	let current = 0;

	if(gallery){
		imgs = Array.from(gallery.querySelectorAll('img'));
		imgs.forEach((img, i)=>{
			img.addEventListener('click', ()=>openLightbox(i));
		});
	}

	function openLightbox(index){
		current = index;
		const src = imgs[current].getAttribute('src');
		lbImage.src = src; lightbox.setAttribute('aria-hidden','false');
		document.body.style.overflow = 'hidden';
	}
	function closeLightbox(){
		lightbox.setAttribute('aria-hidden','true');
		lbImage.src = '';
		document.body.style.overflow = '';
	}
	function showNext(n){
		current = (current + n + imgs.length) % imgs.length;
		lbImage.src = imgs[current].getAttribute('src');
	}

	lbClose.addEventListener('click', closeLightbox);
	lbPrev.addEventListener('click', ()=>showNext(-1));
	lbNext.addEventListener('click', ()=>showNext(1));

	// Close when clicking overlay
	lightbox.addEventListener('click', (e)=>{
		if(e.target === lightbox) closeLightbox();
	});

	// Keyboard nav
	document.addEventListener('keydown', (e)=>{
		if(lightbox.getAttribute('aria-hidden') === 'false'){
			if(e.key === 'Escape') closeLightbox();
			if(e.key === 'ArrowRight') showNext(1);
			if(e.key === 'ArrowLeft') showNext(-1);
		}
	});

	// Interactive product builder
	const buildBtn = document.getElementById('buildBtn');
	const factBtn = document.getElementById('factBtn');
	const buildResult = document.getElementById('buildResult');
	const pearlFlavor = document.getElementById('pearlFlavor');
	const teaSweetness = document.getElementById('teaSweetness');
	const packStyle = document.getElementById('packStyle');

	const factList = [
		'珍奶起源於台灣的手搖飲文化，最早由街邊飲料店帶動社區交流。',
		'台灣珍珠通常使用樹薯澱粉製作，口感Q彈是一大特色。',
		'手搖飲的「搖」字代表的是將飲料與冰塊、配料均勻混合，才能讓風味更滑順。',
		'許多台灣老店會用黑糖珍珠搭配鮮奶，形成濃郁且經典的復古風味。'
	];

	function buildCombo(){
		const flavor = pearlFlavor.value;
		const sweetness = teaSweetness.value;
		const pack = packStyle.value;
		const note = sweetness === '無糖' ? '清爽少負擔' : sweetness === '微糖' ? '溫柔甜度' : '經典台灣甜味';
		buildResult.innerHTML = `
			<h3>你的專屬珍奶方案</h3>
			<p>珍珠口味：<strong>${flavor}</strong></p>
			<p>奶茶甜度：<strong>${sweetness}</strong>（${note}）</p>
			<p>外盒風格：<strong>${pack}</strong></p>
			<p>建議體驗：跟親友一起動手，邊揉珍珠邊聽故事，讓味覺與文化一起成長。</p>
		`;
	}

	function showFact(){
		const fact = factList[Math.floor(Math.random()*factList.length)];
		buildResult.innerHTML = `
			<h3>文化小知識</h3>
			<p class="fact-text">${fact}</p>
		`;
	}

	buildBtn?.addEventListener('click', buildCombo);
	factBtn?.addEventListener('click', showFact);

	// Close nav on resize
	window.addEventListener('resize', ()=>{
		if(window.innerWidth>640) nav.classList.remove('show');
	});

});

