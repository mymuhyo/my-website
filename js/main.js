window.addEventListener("DOMContentLoaded", () => {
  const clock = new BouncyBlockClock(".clock");
});

class BouncyBlockClock {
  constructor(qs) {
    this.el = document.querySelector(qs);
    this.time = { a: [], b: [] };
    this.rollClass = "clock__block--bounce";
    this.digitsTimeout = null;
    this.rollTimeout = null;
    this.mod = 0 * 60 * 1000;

    this.loop();
  }
  animateDigits() {
    const groups = this.el.querySelectorAll("[data-time-group]");

    Array.from(groups).forEach((group, i) => {
      const { a, b } = this.time;

      if (a[i] !== b[i]) group.classList.add(this.rollClass);
    });

    clearTimeout(this.rollTimeout);
    this.rollTimeout = setTimeout(this.removeAnimations.bind(this), 900);
  }
  displayTime() {
    // screen reader time
    const timeDigits = [...this.time.b];
    const ap = timeDigits.pop();

    this.el.ariaLabel = `${timeDigits.join(":")} ${ap}`;

    // displayed time
    Object.keys(this.time).forEach(letter => {
      const letterEls = this.el.querySelectorAll(`[data-time="${letter}"]`);

      Array.from(letterEls).forEach((el, i) => {
        el.textContent = this.time[letter][i];
      });
    });
  }
  loop() {
    this.updateTime();
    this.displayTime();
    this.animateDigits();
    this.tick();
  }
  removeAnimations() {
    const groups = this.el.querySelectorAll("[data-time-group]");

    Array.from(groups).forEach(group => {
      group.classList.remove(this.rollClass);
    });
  }
  tick() {
    clearTimeout(this.digitsTimeout);
    this.digitsTimeout = setTimeout(this.loop.bind(this), 1e3);
  }
  updateTime() {
    const rawDate = new Date();
    const date = new Date(Math.ceil(rawDate.getTime() / 1e3) * 1e3 + this.mod);
    let h = date.getHours();
    const m = date.getMinutes();
    const s = date.getSeconds();
    const ap = h < 12 ? "AM" : "PM";

    if (h === 0) h = 12;
    if (h > 12) h -= 12;

    this.time.a = [...this.time.b];
    this.time.b = [
      (h < 10 ? `0${h}` : `${h}`),
      (m < 10 ? `0${m}` : `${m}`),
      (s < 10 ? `0${s}` : `${s}`),
      ap
    ];

    if (!this.time.a.length) this.time.a = [...this.time.b];
  }
}

// Typing effect

const typedTextSpan = document.querySelector(".typed-text");
const cursorSpan = document.querySelector(".cursor");

const textArray = ["MuhYo"];
const typingDelay = 200;
const erasingDelay = 100;
const newTextDelay = 2000; // Delay between current and next text
let textArrayIndex = 0;
let charIndex = 0;

function type() {
  if (charIndex < textArray[textArrayIndex].length) {
    if (!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
    typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
    charIndex++;
    setTimeout(type, typingDelay);
  }
  else {
    cursorSpan.classList.remove("typing");
    setTimeout(erase, newTextDelay);
  }
}

function erase() {
  if (charIndex > 0) {
    if (!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
    typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
    charIndex--;
    setTimeout(erase, erasingDelay);
  }
  else {
    cursorSpan.classList.remove("typing");
    textArrayIndex++;
    if (textArrayIndex >= textArray.length) textArrayIndex = 0;
    setTimeout(type, typingDelay + 1100);
  }
}

document.addEventListener("DOMContentLoaded", function () { // On DOM Load initiate the effect
  if (textArray.length) setTimeout(type, newTextDelay + 250);
});

// About 