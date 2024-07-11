import { useState } from 'react';
import axios from 'axios';
import { languages } from '@/data/languages';

export default function Home() {
  const [textToTraslate, setText] = useState('');
  const [translation, setTranslation] = useState()
  const [language, setLanguage] = useState()
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(textToTraslate.length > 0 && language) {
      axios.post('api/generate', {
        text: textToTraslate,
        language: language
      })
      .then(function(res) {
        console.log(res.data.result.message.content)
        setTranslation(res.data.result.message.content)
      })
      .catch(function(error) {
        console.log(error);
      })
    }
  };

  return (
    <div id="container">
      <form onSubmit={ handleSubmit }>
        <select name="language" onChange={ (e) => setLanguage(e.target.value) } className="language-input" required>
          { languages.map(lang => <option key={lang} value={lang}>{lang}</option>) }
        </select>
        <textarea
          className="text-input"
          type="text" 
          placeholder="Enter text.." 
          value={ textToTraslate }
          onChange={ (e) => setText(e.target.value) }
          required
        />
        <button type="submit" className="translate-btn">Translate</button>
      </form>
      <p id="translation">{ translation }</p>
    </div>
  )
}