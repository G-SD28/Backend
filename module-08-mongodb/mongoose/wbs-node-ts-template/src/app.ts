import "#db";
import { User, Post } from "#models";

// CRUD Operationen

// CREATE
// const createNewUser = await User.create({
//   firstName: "John",
//   lastName: "Doe",
//   email: "johndoe@mail.com",
// });
// console.log("User created", createNewUser);

// READ
// const allUsers = await User.find();
// console.log(allUsers);

// const findJohn = await User.find({ firstName: "John" });
// console.log(findJohn);

// const findJohnById = await User.findById("6a44cbc0fc658e5777670044");
// console.log(findJohnById);

// UPDATE
// const updateJohn = await User.updateOne(
//   {
//     email: "jd@mail.com",
//   },
//   {
//     email: "johndoe@mail.com",
//   },
// );
// console.log(updateJohn);

// const updateJohnById = await User.findByIdAndUpdate(
//   "6a44cbc0fc658e5777670044",
//   {
//     email: "johndoe@mail.com",
//   },
//   { returnDocument: "after" },
// );
// console.log(updateJohnById);

// DELETE
// const deleteJohn = await User.deleteOne({ firstName: "John" });
// console.log(deleteJohn);
// const deleteJohnById = await User.findByIdAndDelete("6a43ca64104631f7b27ac248")
// console.log(deleteJohnById);

// Relationen

// // Neuen User erstellen
// const newUser = await User.create({
//   firstName: "Testy",
//   lastName: "McTest",
//   email: "testy@test.com",
// });

// console.log("User created", newUser);

// // Erstellen einen neuen Post mit Referenz zum neuen User
// const newPost = await Post.create({
//   title: "My first post",
//   body: "This is some text",
//   author: newUser._id,
// });

// console.log("Post created", newPost);

// const myPost = await Post.find().populate("author", "firstName lastName");
// console.log(myPost);
