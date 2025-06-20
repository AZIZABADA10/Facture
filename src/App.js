import React, { useState, useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    societe: '',
    date: '',
    numeroFacture: '',
    client: '',
    ice: '',
    tva: 20,
    ligneServices: [{ description: '', montant: 0 }],
    texteArrete: '',
    capital: '',
    address: '',
    IF: '',
    RC: '',
    companyICE: '',
    TP: '',
    phone: ''
  });

  const [showPreview, setShowPreview] = useState(false);
  const invoiceRef = useRef(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleServiceChange = (index, field, value) => {
    const newServices = [...formData.ligneServices];
    newServices[index][field] = value;
    setFormData(prev => ({
      ...prev,
      ligneServices: newServices
    }));
  };

  const addService = () => {
    setFormData(prev => ({
      ...prev,
      ligneServices: [...prev.ligneServices, { description: '', montant: 0 }]
    }));
  };

  const removeService = (index) => {
    if (formData.ligneServices.length > 1) {
      const newServices = formData.ligneServices.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        ligneServices: newServices
      }));
    }
  };

  const totalHT = formData.ligneServices.reduce((sum, service) => sum + parseFloat(service.montant || 0), 0);
  const montantTVA = (totalHT * parseFloat(formData.tva || 0)) / 100;
  const totalTTC = totalHT + montantTVA;

 const downloadPDF = () => {
  const input = invoiceRef.current;
  if (!input) {
    alert("Erreur : le contenu de la facture n'est pas prêt !");
    return;
  }

  html2canvas(input, {
    scale: 2,
    useCORS: true,
    scrollY: -window.scrollY  // évite le décalage sur mobile
  }).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = pdf.internal.pageSize.getWidth();
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`facture-${formData.numeroFacture || 'sans-numero'}.pdf`);
  });
};


  return (
    <div className="app-container">
      {showPreview ? (
        <div className="preview-container">
          <div className="preview-actions">
            <button className="btn btn-print" onClick={downloadPDF}>
              Télécharger PDF
            </button>
            <button className="btn btn-back" onClick={() => setShowPreview(false)}>
              Retour
            </button>
          </div>

          <div className="invoice-preview" ref={invoiceRef}>
            <div className="header">
              <div className="company">{formData.societe || 'Nom de la société'}</div>
              <div className="invoice-title">FACTURE</div>
            </div>
            
            <div className="info-section">
              <div className="info-block">
                <p><strong>Facture n° :</strong> {formData.numeroFacture}</p>
                <p><strong>Date :</strong> {formData.date}</p>
              </div>
              <div className="info-block">
                <p><strong>Client :</strong> {formData.client}</p>
                <p><strong>ICE :</strong> {formData.ice}</p>
              </div>
            </div>

            <table className="services-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Montant (DH)</th>
                </tr>
              </thead>
              <tbody>
                {formData.ligneServices.map((service, index) => (
                  <tr key={index}>
                    <td>{service.description}</td>
                    <td className="amount">{parseFloat(service.montant || 0).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="totals">
                <tr>
                  <td className="total-label">Total HT</td>
                  <td className="amount">{totalHT.toFixed(2)}</td>
                </tr>
                <tr>
                  <td className="total-label">TVA ({formData.tva}%)</td>
                  <td className="amount">{montantTVA.toFixed(2)}</td>
                </tr>
                <tr className="total-final">
                  <td className="total-label">TOTAL TTC</td>
                  <td className="amount">{totalTTC.toFixed(2)} DH</td>
                </tr>
              </tfoot>
            </table>

            {formData.texteArrete && (
              <div className="arrete-text">
                <p><strong>Arrêtée le présent Facture à la somme de :</strong> {formData.texteArrete}</p>
              </div>
            )}

            <div className="signature-section">
              <p><strong>Signature</strong></p>
              <div className="signature-line"></div>
            </div>

            <div className="footer">
              <p>
                {formData.capital && `CAPITAL: ${formData.capital}`} 
                {formData.address && ` ADRESSE: ${formData.address}`}
                {formData.IF && ` - IF:${formData.IF}`}
                {formData.RC && ` RC N°:${formData.RC}`}
                {formData.companyICE && ` ICE: ${formData.companyICE}`}
                {formData.TP && ` - TP:${formData.TP}`}
                {formData.phone && ` TÉL:${formData.phone}`}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="form-container">
          <h2>Générateur de Facture PDF</h2>
          
          <div className="form-section">
            <h3>Informations générales</h3>
            <div className="form-grid">
              <input
                type="text"
                placeholder="Nom de la société"
                value={formData.societe}
                onChange={(e) => handleInputChange('societe', e.target.value)}
              />
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
              />
              <input
                type="text"
                placeholder="Numéro de facture"
                value={formData.numeroFacture}
                onChange={(e) => handleInputChange('numeroFacture', e.target.value)}
              />
              <input
                type="text"
                placeholder="Nom du client"
                value={formData.client}
                onChange={(e) => handleInputChange('client', e.target.value)}
              />
              <input
                type="text"
                placeholder="ICE"
                value={formData.ice}
                onChange={(e) => handleInputChange('ice', e.target.value)}
              />
              <input
                type="number"
                placeholder="TVA (%)"
                value={formData.tva}
                onChange={(e) => handleInputChange('tva', e.target.value)}
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Services</h3>
            {formData.ligneServices.map((service, index) => (
              <div key={index} className="service-row">
                <input
                  type="text"
                  placeholder="Description du service"
                  value={service.description}
                  onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
                  className="service-description"
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Montant"
                  value={service.montant}
                  onChange={(e) => handleServiceChange(index, 'montant', e.target.value)}
                  className="service-amount"
                />
                {formData.ligneServices.length > 1 && (
                  <button
                    onClick={() => removeService(index)}
                    className="btn-remove"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button onClick={addService} className="btn-add-service">
              + Ajouter un service
            </button>
          </div>

          <div className="summary">
            <h4>Récapitulatif</h4>
            <div className="summary-grid">
              <div>
                <p>Total HT</p>
                <p className="summary-value">{totalHT.toFixed(2)} DH</p>
              </div>
              <div>
                <p>TVA ({formData.tva}%)</p>
                <p className="summary-value">{montantTVA.toFixed(2)} DH</p>
              </div>
              <div>
                <p>Total TTC</p>
                <p className="summary-total">{totalTTC.toFixed(2)} DH</p>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Informations complémentaires</h3>
            <textarea
              placeholder="Texte de l'arrêté (optionnel)"
              value={formData.texteArrete}
              onChange={(e) => handleInputChange('texteArrete', e.target.value)}
              rows={3}
            />

            <h4>Informations de la société</h4>
            <div className="form-grid">
              <input
                type="text"
                placeholder="Capital"
                value={formData.capital}
                onChange={(e) => handleInputChange('capital', e.target.value)}
              />
              <input
                type="text"
                placeholder="Adresse"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
              />
              <input
                type="text"
                placeholder="IF"
                value={formData.IF}
                onChange={(e) => handleInputChange('IF', e.target.value)}
              />
              <input
                type="text"
                placeholder="RC"
                value={formData.RC}
                onChange={(e) => handleInputChange('RC', e.target.value)}
              />
              <input
                type="text"
                placeholder="ICE"
                value={formData.companyICE}
                onChange={(e) => handleInputChange('companyICE', e.target.value)}
              />
              <input
                type="text"
                placeholder="TP"
                value={formData.TP}
                onChange={(e) => handleInputChange('TP', e.target.value)}
              />
              <input
                type="text"
                placeholder="Téléphone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </div>
          </div>

          <div className="action-buttons">
            <button
              onClick={() => setShowPreview(true)}
              className="btn btn-preview"
            >
              Aperçu de la facture 
            </button>
          
          </div>
        </div>
      )}
    </div>
  );
}

export default App;