export const omodal = ($ref) => {
    if(!$ref.current.classList.contains("in")){
        $ref.current.classList.add('opening_modal');
        $ref.current.setAttribute("data-backdrop","static");
        $ref.current.setAttribute("data-keyboard","false");
        $ref.current.setAttribute("role","dialog");
        $ref.current.modal("show");
    }
}