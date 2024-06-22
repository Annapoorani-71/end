const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;

mongoose.connect('mongodb+srv://annapooranikumar71:2xpSgdvEFmdUgohm@firstcluster.bfoudmi.mongodb.net/?retryWrites=true&w=majority&appName=FirstCluster')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    // imageUrl: { type: String, required: true }
});

const User = mongoose.model('User', UserSchema);

app.use(express.json());
app.use(cors());

app.post('/posts', async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = new User({ name, email,  });
        const savedUser = await user.save();
        res.json(savedUser);
    } catch (err) {
        console.error('Error saving user:', err);
        res.status(500).send('Something went wrong when saving data.');
    }
});

app.get('/posts', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        console.error('Error retrieving users:', err);
        res.status(500).send('Failed to retrieve user data');
    }
});

app.put('/posts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;
        const updatedUser = await User.findByIdAndUpdate(id, { name, email }, { new: true });

        if (!updatedUser) {
            return res.status(404).send('User not found');
        }

        res.json(updatedUser);
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).send('Failed to update user');
    }
});

app.delete('/posts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).send('User not found');
        }

        res.send('User deleted successfully');
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).send('Failed to delete user');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
