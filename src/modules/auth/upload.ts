export const getCanvasBlob = (canvas: any) => {
    return new Promise(function (resolve) {
        canvas.toBlob((blob: any) => {
            resolve(blob);
        }, 'image/jpeg', 1)
    })
}

export const generateAvatarUpload = async (canvas: any, crop: any) => {
    if (!crop || !canvas) {
        return null;
    }
    let file = null;
    const canvasBlob: any = await getCanvasBlob(canvas);
    file = new File([canvasBlob], 'avatar.jpeg', { type: 'image/jpeg' });
    return file;
}