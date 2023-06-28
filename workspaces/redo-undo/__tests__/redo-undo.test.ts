import UndoRedo from ".."

const ur = new UndoRedo('[]')

const arr = ['a', 'abc', 'ac', 'bc', 'xyz']

arr.forEach(s => ur.update(s))

console.log(ur)

console.log(ur.getValue(), ur.canUndo())
while (ur.canUndo()) {
    ur.undo()
    console.log(ur.getValue(), ur.canUndo())
}
while (ur.canRedo()) {
    ur.redo()
    console.log(ur.getValue(), ur.canRedo())
}

ur.undo()
ur.undo()
ur.undo()

ur.update('www')

console.log(ur, ur.getValue())
ur.undo()
console.log(ur, ur.getValue())

const snap = ur.snap()

const ur2 = UndoRedo.from(snap)

console.log(ur2, ur2.getValue())


