import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'


import mosesImg from './assets/moses.png'       
import justinImg from './assets/justin.png'     
import nicholasImg from './assets/nicholas.png' 

function App() {
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [typedText, setTypedText] = useState("")

  const developers = [
    { 
      name: "Moses Alvin", 
      role: "SOFTWARE Engineer", 
      linkedin: "https://www.linkedin.com/in/alvin-panjaitan", 
      photo: mosesImg 
    },
    { 
      name: "Justin Christoper", 
      role: "AI  Engineer", 
      linkedin: "https://www.linkedin.com/in/justin-christroper-b48494390/", 
      photo: justinImg 
    },
    { 
      name: "Nicholas Salim", 
      role: "AI Engineer", 
      linkedin: "https://www.linkedin.com/in/nicholas-salim-7759ba326/", 
      photo: nicholasImg 
    },
  ]

  useEffect(() => {
    if (result && result.comparison) {
      setTypedText(""); 
      let i = 0;
      const fullText = result.comparison;
      const typingInterval = setInterval(() => {
        if (i < fullText.length) {
          setTypedText((prev) => prev + fullText.charAt(i));
          i++;
        } else {
          clearInterval(typingInterval);
        }
      }, 10); 
      return () => clearInterval(typingInterval);
    }
  }, [result]);

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      setPreview(URL.createObjectURL(file))
      setResult(null)
      setError(null)
      setTypedText("")
      e.target.value = null; 
    }
  }

  const handleAnalyze = async () => {
    if (!image) return
    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append('image', image)

    try {
      const response = await axios.post('http://127.0.0.1:5000/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setResult(response.data.data)
    } catch (err) {
      console.error(err)
      setError("Gagal terhubung ke server. Coba lagi!")
    } finally {
      setLoading(false)
    }
  }

  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num)
  }

  const handleReset = () => {
    setImage(null)
    setPreview(null)
    setResult(null)
    setTypedText("")
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        
        <nav className="navbar">
          <div className="logo">CarbonLens</div>
        </nav>

        <main className="main-content">
          
          <input 
            type="file" 
            id="fileInput" 
            accept="image/*" 
            onChange={handleImageChange} 
            hidden 
          />


          {!result && (
            <div className="fade-in" style={{width: '100%', display: 'flex', flexDirection: 'column'}}>
              {!preview ? (
                
                <div className="hero-section">
                   <div className="hero-icon">🌍</div>
                   <div>
                     <h2>Cek Jejak Karbonmu</h2>
                     <p className="slogan">Upload struk belanjamu dan biarkan AI menghitung emisi karbon yang dihasilkan.</p>
                   </div>
                   
                   <label htmlFor="fileInput" className="start-btn">
                     Scan Struk Sekarang
                   </label>
                </div>
              ) : (

                <div className="preview-section">
                  <div className="preview-frame">
                    <img src={preview} alt="Preview" className="preview-img" />
                  </div>
                  
                  <div className="action-buttons">
                    {loading ? (
                      <div className="loading-box">
                        <div className="spinner"></div>
                        <p>Sedang Menganalisis...</p>
                      </div>
                    ) : (
                      <>
                        <button onClick={handleAnalyze} className="primary-btn">Hitung Emisi</button>
                        <label htmlFor="fileInput" className="secondary-btn">Ganti Foto</label>
                        <button onClick={handleReset} className="cancel-btn">Batal</button>
                      </>
                    )}
                    {error && <div style={{color: 'red', textAlign:'center', fontSize:'0.9rem'}}>{error}</div>}
                  </div>
                </div>
              )}
            </div>
          )}

      
          {result && (
            <div className="result-view fade-in">
              <div className="total-card">
                <div className="label">Total Emisi</div>
                <div className="value">{result.total_co2_kg} <small>kg CO₂e</small></div>
                <div className="range-info">
                  ± {result.range.min} - {result.range.max} kg CO₂e
                </div>
              </div>

              <div className="comparison-card">
                <div className="icon">💡</div>
                <div className="text">
                   {typedText}<span className="cursor-blink">|</span> 
                </div>
              </div>

              <div className="items-list">
                <div className="section-title" style={{textAlign:'left', marginBottom:'10px'}}>Rincian Item</div>
                {result.items.map((item, index) => (
                  <div key={index} className="item-card">
                    <div>
                      <div className="item-name">{item.name}</div>
                      <div className="item-price">
                        {formatRupiah(item.total_price)} x {item.qty}
                      </div>
                    </div>
                    <div className="co2-badge">{item.co2_kg} kg</div>
                  </div>
                ))}
              </div>

              <button onClick={handleReset} className="secondary-btn" style={{marginTop: '20px'}}> Scan Struk Lain</button>
            </div>
          )}

          <div className="dev-section">
            <div className="section-title">meet the developers</div>

            <div className="dev-container">
              {developers.map((dev, index) => (
                <a 
                  key={index} 
                  href={dev.linkedin} 
                  target="_blank"         
                  rel="noopener noreferrer" 
                  className="dev-card"
                >
       
                  <img src={dev.photo} alt={dev.name} className="dev-photo" />
                  
                  <div className="dev-name">{dev.name}</div>
                  <div className="dev-role">{dev.role}</div>
                </a>
              ))}
            </div>
            
            <div className="sub-footer"> Group 19 • AOL Artificial Intelligence</div>
          </div>

        </main>

      </div>
    </div>
  )
}

export default App