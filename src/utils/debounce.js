export function debounce(time) {
  let id = null;
  return function(fn){
    if (id) {
      clearTimeout(id);
    }
    id = setTimeout(fn, time * 1000);
  };
}