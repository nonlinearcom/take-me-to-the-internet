const activeNoteId = ref<string | null>(null)

export function useFootNotes() {
  /**
   * Set the active note by its ID.
   * @param id - The ID of the note to activate.
   */
  function setActiveNote(id: string) {
    activeNoteId.value = id
    setTimeout(() => {
      activeNoteId.value = null
    }, 250)
  }

  /**
   * Clear the active note.
   */
  function clearActiveNote() {
    activeNoteId.value = null
  }
  return {
    activeNoteId,
    setActiveNote,
    clearActiveNote,
  }
}
