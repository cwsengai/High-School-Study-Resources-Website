document.addEventListener("DOMContentLoaded", function () {
  // filter variables
  const checkboxes = document.querySelectorAll('.filter input[type="checkbox"]');
  const cards = document.querySelectorAll('.course-notes .card');
  const allGradeCheckbox = document.querySelector('.all-grade');
  const allSubjectCheckbox = document.querySelector('.all-subject');
  const gradeCheckboxes = document.querySelectorAll('.filter-by-grade input[type="checkbox"]:not(.all-grade)');
  const subjectCheckboxes = document.querySelectorAll('.filter-by-subject input[type="checkbox"]:not(.all-subject)');

  // Search elements
  const searchInput = document.querySelector('.search-bar input[type="search"]');
  const searchButton = document.querySelector('.search-button');

  //nav bar study resources buttons
  const navbarfilterButtons = document.querySelectorAll('.filter-grade');
  const navbarfilterall = document.querySelector('.filter-all')

  let gradeselected = null;
  let allgradeselected = false;


  navbarfilterButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault(); 

      gradeselected = btn.dataset.grade; 
      filterCards();
      gradeselected = null;
    });
  });

  navbarfilterall.addEventListener('click', ()=>{
    allgradeselected = true;
    filterCards();
    allgradeselected = false;
  });

  // filter checkbox event listeners
  allGradeCheckbox.addEventListener('change', function () {
    gradeCheckboxes.forEach(cb => cb.checked = this.checked);
    filterCards();
  });

  allSubjectCheckbox.addEventListener('change', function () {
    subjectCheckboxes.forEach(cb => cb.checked = this.checked);
    filterCards();
  });

  gradeCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      if (!cb.checked) {
        allGradeCheckbox.checked = false;
      } else if ([...gradeCheckboxes].every(g => g.checked)) {
        allGradeCheckbox.checked = true;
      }
      filterCards();
    });
  });

  subjectCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      if (!cb.checked) {
        allSubjectCheckbox.checked = false;
      } else if ([...subjectCheckboxes].every(s => s.checked)) {
        allSubjectCheckbox.checked = true;
      }
      filterCards();
    });
  });

  checkboxes.forEach(checkbox => {
    checkbox.addEventListener("change", filterCards);
  });

  // Search event listeners
  searchButton.addEventListener('click', function(e) {
    e.preventDefault(); // Prevent form submission
    filterCards();
  });

  searchInput.addEventListener('input', filterCards); // Filter as user types

  // filterCards function with search functionality
  function filterCards() {
    const selectedGrades = [];
    const selectedSubjects = [];
    const searchTerm = searchInput.value.toLowerCase(); // NEW: Get search term

    // Get selected grades
    if (!allGradeCheckbox.checked) {
      gradeCheckboxes.forEach(cb => {
        if (cb.checked) {
          selectedGrades.push(cb.parentElement.textContent.trim().replace("Grade ", ""));
        }
      });
    }

    // Get selected subjects
    if (!allSubjectCheckbox.checked) {
      subjectCheckboxes.forEach(cb => {
        if (cb.checked) {
          selectedSubjects.push(cb.parentElement.textContent.trim());
        }
      });
    }

    //nav bar selected grades
    if(gradeselected){
      selectedGrades.push(gradeselected);
    }

    if(allgradeselected){
      selectedGrades.push("10", "11", "12");
    }

    cards.forEach(card => {
      const cardGrade = card.getAttribute("data-grade");
      const cardSubject = card.getAttribute("data-subject");
      const cardTitle = card.querySelector('.card-title').textContent.toLowerCase(); // NEW: Get card title
      const cardText = card.querySelector('.card-text').textContent.toLowerCase(); // NEW: Get card text

      // Check if matches filters
      const gradeMatch = allGradeCheckbox.checked || selectedGrades.length === 0 || selectedGrades.includes(cardGrade);
      const subjectMatch = allSubjectCheckbox.checked || selectedSubjects.length === 0 || selectedSubjects.includes(cardSubject);
      
      // Check if matches search term
      const searchMatch = searchTerm === '' || 
                         cardTitle.includes(searchTerm) || 
                         cardText.includes(searchTerm);

      // Show card only if it matches ALL active filters
      card.style.display = (gradeMatch && subjectMatch && searchMatch) ? "" : "none";
    });
  }

});
