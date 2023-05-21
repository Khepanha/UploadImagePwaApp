let observationImage = []

const reset = () => {
    observationImage = []
}

const getCurrentImage = (image) => {
    return observationImage.filter(i => {
        if (i.questionId === image.questionId) {
            return i.id !== image.id
        }
        else {
            return true
        }
    })
}

const addImage = (image) => {
    if (observationImage.length >= 15) {
        return { isSucess: false, message: "Maximum 15 photos par formulaire" }
    }
    const newObservationImage = getCurrentImage(image)
    newObservationImage.push(image)
    observationImage = newObservationImage
    return { isSucess: true, message: "Télécharger la photo ici" }
}

const removeImage = (image) => {
    const newObservationImage = getCurrentImage(image)
    observationImage = newObservationImage
}

const getImage = () => {
    return [...observationImage]
}

const getImageOfObservation = (questionId) => {
    return [...observationImage.filter(i => i.questionId === questionId)]
}

export {
    reset,
    addImage,
    removeImage,
    getImage,
    getImageOfObservation
}