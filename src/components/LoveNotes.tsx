import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit3, Heart, Trash2 } from 'lucide-react';
import { supabase } from '../supabaseClient'; 

interface LoveNote {
  id: number;
  title: string;
  message: string;
  color: string;
  date: string;
}

const colors = [
  "from-blush-200 to-blush-300",
  "from-lavender-200 to-lavender-300",
  "from-mint-200 to-mint-300",
  "from-coral-200 to-coral-300",
  "from-sunny-200 to-sunny-300"
];

const LoveNotes: React.FC = () => {
  const [notes, setNotes] = useState<LoveNote[]>([]);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editMessage, setEditMessage] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    const { data, error } = await supabase
      .from('love_notes')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching notes:', error);
    } else if (data) {
      const formattedNotes = data.map(note => ({
        ...note,
        date: new Date(note.date).toLocaleString()
      }));
      setNotes(formattedNotes);
    }
  };

  const addNote = async () => {
    console.log('Adding new note...');
    const color = colors[Math.floor(Math.random() * colors.length)];
    const newNote = {
      title: "",
      message: "",
      color,
      date: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('love_notes')
      .insert(newNote)
      .select()
      .single();

    if (error) {
      console.error('Error adding note:', error);
    } else if (data) {
      setNotes(prev => [ { ...data, date: new Date(data.date).toLocaleString() }, ...prev ]);
      setIsEditing(data.id);
      setEditTitle(data.title);
      setEditMessage(data.message);
    }
  };

  const startEditing = (note: LoveNote) => {
    setIsEditing(note.id);
    setEditTitle(note.title);
    setEditMessage(note.message);
  };

  const saveNote = async () => {
    if (!isEditing) return;

    const { data, error } = await supabase
      .from('love_notes')
      .update({ title: editTitle, message: editMessage, date: new Date().toISOString() })
      .eq('id', isEditing)
      .select()
      .single();

    if (error) {
      console.error('Error saving note:', error);
    } else if (data) {
      setNotes(prev =>
        prev.map(note =>
          note.id === isEditing ? { ...note, title: data.title, message: data.message, date: new Date(data.date).toLocaleString() } : note
        )
      );
      setIsEditing(null);
      setEditTitle('');
      setEditMessage('');
    }
  };

  const deleteNote = async (id: number) => {
    const { error } = await supabase
      .from('love_notes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting note:', error);
    } else {
      setNotes(prev => prev.filter(note => note.id !== id));
      if (isEditing === id) {
        setIsEditing(null);
        setEditTitle('');
        setEditMessage('');
      }
    }
  };

  const cancelEdit = () => {
    setIsEditing(null);
    setEditTitle('');
    setEditMessage('');
  };

return (
    <section className="py-20 bg-gradient-to-br from-sunny-50 to-coral-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-sunny-500 to-coral-500 bg-clip-text text-transparent">
              Love Notes
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Sweet messages from my heart to yours. Add your own to make this space truly ours.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Add Note Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={addNote}
              className="bg-gradient-to-r from-sunny-500 to-coral-500 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-shadow inline-flex items-center"
            >
              <Plus size={20} className="mr-2" />
              Add New Love Note
            </motion.button>
          </motion.div>

          {/* Notes Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note, index) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className={`bg-gradient-to-br ${note.color} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 relative group`}
              >
                {/* Note Actions */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => startEditing(note)}
                    className="bg-white/80 backdrop-blur-sm rounded-full p-2 text-gray-600 hover:text-sunny-600 transition-colors"
                  >
                    <Edit3 size={16} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => deleteNote(note.id)}
                    className="bg-white/80 backdrop-blur-sm rounded-full p-2 text-gray-600 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </motion.button>
                </div>

                {isEditing === note.id ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full bg-white/50 backdrop-blur-sm rounded-lg px-3 py-2 text-lg font-semibold placeholder-gray-500 border-none outline-none focus:ring-2 focus:ring-white/50"
                      placeholder="Note title..."
                    />
                    <textarea
                      value={editMessage}
                      onChange={(e) => setEditMessage(e.target.value)}
                      className="w-full bg-white/50 backdrop-blur-sm rounded-lg px-3 py-2 text-gray-700 placeholder-gray-500 border-none outline-none focus:ring-2 focus:ring-white/50 resize-none"
                      rows={5}
                      placeholder="Your sweet message..."
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={saveNote}
                        className="bg-white text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex-1"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="bg-white/50 text-gray-600 px-4 py-2 rounded-lg font-medium hover:bg-white/70 transition-colors flex-1"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {note.title}
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {note.message}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{note.date}</span>
                      <Heart size={16} className="text-gray-500" />
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </div>

          {/* Edit Instructions */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center mt-12 text-gray-500 text-sm"
          >
            <Heart size={16} className="inline mr-2" />
            Hover over notes to edit or delete • Express your love in your own words
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LoveNotes;