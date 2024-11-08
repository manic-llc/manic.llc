export default (text: Promise<any>, cb: any) => {
  if (!navigator.clipboard || !window.ClipboardItem) return cb(false);

  navigator.clipboard.write([new ClipboardItem({ "text/plain": text })]).then(
    () => {
      cb(true);
    },

    () => {
      cb(false);
    },
  );
};
