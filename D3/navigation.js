document.addEventListener("DOMContentLoaded", () => {
    let currentSlideIndex = 0;
    const slides = document.querySelectorAll(".slide");
    const nextButtons = document.querySelectorAll(".next-slide");
    const prevButtons = document.querySelectorAll(".prev-slide");

    // Function to show the specified slide
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle("active", i === index);
        });
        updateNavigationButtons(index);
    }

    // Function to update navigation buttons visibility
    function updateNavigationButtons(index) {
        nextButtons.forEach(button => {
            button.style.display = (index < slides.length - 1) ? 'inline' : 'none';
        });
        prevButtons.forEach(button => {
            button.style.display = (index > 0) ? 'inline' : 'none';
        });
    }

    // Initialize the first slide as active
    showSlide(currentSlideIndex);

    // Event listener for the "Next" button
    nextButtons.forEach(button => {
        button.addEventListener("click", () => {
            const nextSlideId = button.getAttribute("data-next-slide");
            const nextSlideIndex = Array.from(slides).findIndex(slide => slide.id === nextSlideId);

            if (nextSlideIndex !== -1) {
                currentSlideIndex = nextSlideIndex;
                showSlide(currentSlideIndex);
            } else {
                alert("Unable to find the next slide.");
            }
        });
    });

    // Event listener for the "Previous" button
    prevButtons.forEach(button => {
        button.addEventListener("click", () => {
            const prevSlideId = button.getAttribute("data-prev-slide");
            const prevSlideIndex = Array.from(slides).findIndex(slide => slide.id === prevSlideId);

            if (prevSlideIndex !== -1) {
                currentSlideIndex = prevSlideIndex;
                showSlide(currentSlideIndex);
            } else {
                alert("Unable to find the previous slide.");
            }
        });
    });
});
