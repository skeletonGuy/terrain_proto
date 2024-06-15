export const initMapFileInput = (callback) => {
  const input = document.getElementById('image_map_input');

  input.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const image = new Image();
      image.src = e.target.result;
      image.onload = () => callback(image);
    };

    reader.readAsDataURL(file);
  });
};
