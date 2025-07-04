// ThirdLayer Technologies - Custom JavaScript

document.addEventListener("DOMContentLoaded", () => {
  // Initialize all functionality
  initHeroBackground()
  initScrollAnimations()
  initCounterAnimations()
  initNavigation()
  initContactForm()
  initSmoothScrolling()
})

// Hero Background Canvas Animation
function initHeroBackground() {
  const canvas = document.getElementById("heroCanvas")
  if (!canvas) return

  const ctx = canvas.getContext("2d")

  function resizeCanvas() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }

  resizeCanvas()
  window.addEventListener("resize", resizeCanvas)

  // Create gradient background
  function createGradient() {
    const gradient = ctx.createRadialGradient(
      canvas.width / 2,
      canvas.height / 2,
      0,
      canvas.width / 2,
      canvas.height / 2,
      canvas.width / 2,
    )
    gradient.addColorStop(0, "rgba(59, 130, 246, 0.1)")
    gradient.addColorStop(0.5, "rgba(139, 92, 246, 0.05)")
    gradient.addColorStop(1, "rgba(15, 23, 42, 1)")
    return gradient
  }

  // Animated grid and orbs
  let time = 0
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Background gradient
    ctx.fillStyle = createGradient()
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Animated grid lines
    ctx.strokeStyle = "rgba(59, 130, 246, 0.1)"
    ctx.lineWidth = 1

    const gridSize = 50
    const offsetX = (time * 0.5) % gridSize
    const offsetY = (time * 0.3) % gridSize

    // Vertical lines
    for (let x = -offsetX; x < canvas.width + gridSize; x += gridSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }

    // Horizontal lines
    for (let y = -offsetY; y < canvas.height + gridSize; y += gridSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }

    // Floating orbs
    const orbCount = 5
    for (let i = 0; i < orbCount; i++) {
      const x = canvas.width * 0.2 + Math.sin(time * 0.01 + i) * 200
      const y = canvas.height * 0.3 + Math.cos(time * 0.008 + i) * 150
      const radius = 100 + Math.sin(time * 0.02 + i) * 20

      const orbGradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
      orbGradient.addColorStop(0, `rgba(${i % 2 ? "59, 130, 246" : "139, 92, 246"}, 0.1)`)
      orbGradient.addColorStop(1, "rgba(0, 0, 0, 0)")

      ctx.fillStyle = orbGradient
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
    }

    time += 1
    requestAnimationFrame(animate)
  }

  animate()
}

// Scroll Animations
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animated")
      }
    })
  }, observerOptions)

  // Add animation class to elements
  const animateElements = document.querySelectorAll(
    ".service-card, .project-card, .team-card, .testimonial-card, .contact-item",
  )
  animateElements.forEach((el) => {
    el.classList.add("animate-on-scroll")
    observer.observe(el)
  })
}

// Counter Animations
function initCounterAnimations() {
  const counters = document.querySelectorAll(".stat-number")
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const counter = entry.target
          const target = Number.parseInt(counter.getAttribute("data-target"))
          animateCounter(counter, target)
          counterObserver.unobserve(counter)
        }
      })
    },
    { threshold: 0.5 },
  )

  counters.forEach((counter) => {
    counterObserver.observe(counter)
  })
}

function animateCounter(element, target) {
  let current = 0
  const increment = target / 100
  const duration = 2000
  const stepTime = duration / 100

  const timer = setInterval(() => {
    current += increment
    if (current >= target) {
      current = target
      clearInterval(timer)
    }

    const suffix = element.getAttribute("data-target") === "98" ? "%" : "+"
    element.textContent = Math.floor(current) + suffix
  }, stepTime)
}

// Navigation
function initNavigation() {
  const navbar = document.querySelector(".custom-navbar")
  const navLinks = document.querySelectorAll(".nav-link")

  // Navbar scroll effect
  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      navbar.style.background = "rgba(15, 23, 42, 0.95)"
    } else {
      navbar.style.background = "rgba(15, 23, 42, 0.9)"
    }
  })

  // Active section highlighting
  const sections = document.querySelectorAll("section[id]")

  window.addEventListener("scroll", () => {
    const scrollPosition = window.scrollY + 100

    sections.forEach((section) => {
      const sectionTop = section.offsetTop
      const sectionHeight = section.offsetHeight
      const sectionId = section.getAttribute("id")

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove("active")
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active")
          }
        })
      }
    })
  })
}

// Contact Form
function initContactForm() {
  const contactForm = document.querySelector(".contact-form")
  if (!contactForm) return

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const formData = new FormData(contactForm)
    const submitBtn = contactForm.querySelector('button[type="submit"]')
    const originalText = submitBtn.innerHTML
    const action = contactForm.action

    // Simple validation (can also rely on HTML 'required' attribute)
    if (!formData.get("name") || !formData.get("email") || !formData.get("message")) {
      showNotification("Please fill in all required fields.", "error")
      return
    }

    // Update button for pending state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...'
    submitBtn.disabled = true

    try {
      const response = await fetch(action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      })

      if (response.ok) {
        // Success state
        submitBtn.innerHTML = '<i class="fas fa-check me-2"></i>Message Sent!'
        showNotification("Thank you! Your message has been sent successfully.", "success")
        contactForm.reset()
        setTimeout(() => {
          submitBtn.innerHTML = originalText
          submitBtn.disabled = false
        }, 3000)
      } else {
        // Handle server-side errors from Formspree
        const data = await response.json()
        let errorMessage = "Oops! There was a problem submitting your form."
        if (data.errors) {
          errorMessage = data.errors.map((error) => error.message).join(", ")
        }
        showNotification(errorMessage, "error")
        // Reset button on error
        submitBtn.innerHTML = originalText
        submitBtn.disabled = false
      }
    } catch (error) {
      // Handle network errors
      showNotification("Oops! A network error occurred. Please try again.", "error")
      // Reset button on error
      submitBtn.innerHTML = originalText
      submitBtn.disabled = false
    }
  })
}

// Smooth Scrolling
function initSmoothScrolling() {
  const links = document.querySelectorAll('a[href^="#"]')

  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href")
      const targetSection = document.querySelector(targetId)

      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80

        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        })
      }
    })
  })
}

// Notification System
function showNotification(message, type = "info") {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll(".notification")
  existingNotifications.forEach((notification) => notification.remove())

  // Create notification element
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === "success" ? "check-circle" : type === "error" ? "exclamation-circle" : "info-circle"} me-2"></i>
            ${message}
        </div>
    `

  // Add styles
  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${
          type === "success"
            ? "linear-gradient(135deg, #10b981, #059669)"
            : type === "error"
              ? "linear-gradient(135deg, #ef4444, #dc2626)"
              : "linear-gradient(135deg, #3b82f6, #2563eb)"
        };
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 9999;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 350px;
        font-weight: 500;
    `

  document.body.appendChild(notification)

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)"
  }, 100)

  // Auto remove
  setTimeout(() => {
    notification.style.transform = "translateX(400px)"
    setTimeout(() => {
      notification.remove()
    }, 300)
  }, 5000)
}

// Service Card Hover Effects
document.addEventListener("DOMContentLoaded", () => {
  const serviceCards = document.querySelectorAll(".service-card")

  serviceCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      const gradient = this.getAttribute("data-gradient")
      if (gradient) {
        this.style.setProperty("--hover-gradient", getGradientByName(gradient))
      }
    })
  })
})

function getGradientByName(gradientName) {
  const gradients = {
    "blue-purple": "linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))",
    "pink-orange": "linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(249, 115, 22, 0.1))",
    "green-teal": "linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(6, 182, 212, 0.1))",
    "violet-indigo": "linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(99, 102, 241, 0.1))",
    "amber-orange": "linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(249, 115, 22, 0.1))",
    "red-rose": "linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(244, 63, 94, 0.1))",
  }

  return gradients[gradientName] || gradients["blue-purple"]
}

// Parallax Effect for Hero Section
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset
  const heroContent = document.querySelector(".hero-content")

  if (heroContent) {
    const rate = scrolled * -0.5
    heroContent.style.transform = `translateY(${rate}px)`
  }
})

// Mobile Menu Toggle
document.addEventListener("DOMContentLoaded", () => {
  const navbarToggler = document.querySelector(".navbar-toggler")
  const navbarCollapse = document.querySelector(".navbar-collapse")

  if (navbarToggler && navbarCollapse) {
    navbarToggler.addEventListener("click", () => {
      navbarCollapse.classList.toggle("show")
    })

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll(".nav-link")
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navbarCollapse.classList.remove("show")
      })
    })
  }
})

// Loading Animation
window.addEventListener("load", () => {
  document.body.classList.add("loaded")

  // Trigger hero animations
  const heroContent = document.querySelector(".hero-content")
  if (heroContent) {
    heroContent.style.animation = "fadeInUp 1s ease-out"
  }
})

// Intersection Observer for better performance
const observerOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0.1,
}

const performanceObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // Add any performance-related animations here
      entry.target.classList.add("in-view")
    }
  })
}, observerOptions)

// Observe all major sections
document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("section")
  sections.forEach((section) => {
    performanceObserver.observe(section)
  })
})
