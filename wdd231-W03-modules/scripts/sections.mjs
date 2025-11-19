export function setSectionSelection(sections) {
    const sectionSelect = document.querySelector("#sectionNumber");
    sectionSelect.innerHTML = ""; // limpiar opciones previas
    sections.forEach((section) => {
        const option = document.createElement("option");
        option.value = section.sectionNumber;
        option.textContent = `Section ${section.sectionNumber}`;
        sectionSelect.appendChild(option);
    });
}