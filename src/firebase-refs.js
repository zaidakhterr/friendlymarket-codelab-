// TODO: UPDATE THIS FUNCTION AFTER INSTALLING
// THE storage-resize-images EXTENSION
export function getImageRef(storage, imagePath) {
  const xDimension = 200;
  const yDimension = 200;

  // find the '.' in 'file.jpg', 'file.png', etc
  const fileExtensionIndex = imagePath.lastIndexOf('.');

  const pathNameWithoutExtension = imagePath.substring(0, fileExtensionIndex);
  const dimensions = `${xDimension}x${yDimension}`;
  const fileExtension = imagePath.substring(fileExtensionIndex);

  return {
    resized: storage().ref(
      `${pathNameWithoutExtension}_${dimensions}${fileExtension}`
    ),
    original: storage().ref(imagePath)
  };
}

export function getSellerRef(database, sellerId) {
  return database().ref(`sellers/${sellerId}`);
}

export function getDraftListRef(database) {
  return database().ref('drafts');
}

export function getDraftItemRef(database, draftId) {
  return getDraftListRef(database).child(draftId);
}

export function getForSaleListRef(database) {
  return database().ref('forsale');
}

export function getNewSaleItemRef(database) {
  return getForSaleListRef(database).push();
}

export function getForSaleItemRef(database, itemId) {
  return getForSaleListRef(database).child(itemId);
}

export function getSellerEmailRef(database, sellerId) {
  return database()
    .ref('sellers')
    .child(sellerId)
    .child('contactEmail');
}
export function getSellerNameRef(database, sellerId) {
  return database()
    .ref('sellers')
    .child(sellerId)
    .child('name');
}

export function updateDraftField(draftRef, field) {
  return function(newValue) {
    draftRef.update({ [field]: newValue });
  };
}
