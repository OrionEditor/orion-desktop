export function gapRightSection(){
    const rightSection = document.querySelector('.right-section') as HTMLElement;

    if (rightSection) {
        rightSection.style.flex = "0 0 100%";
    }
}