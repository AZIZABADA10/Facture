import React, { useState } from 'react';

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

  // Gestion des changements dans le formulaire
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

  // Calculs
  const totalHT = formData.ligneServices.reduce((sum, service) => sum + parseFloat(service.montant || 0), 0);
  const montantTVA = (totalHT * parseFloat(formData.tva || 0)) / 100;
  const totalTTC = totalHT + montantTVA;

  // Génération PDF avec jsPDF
  const generatePDF = () => {
    const generatePDFContent = () => {
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>Facture ${formData.numeroFacture}</title>
            <style>
              /* Ajout d'un conteneur flex pour gérer la hauteur */
              body, html {
                height: 100%;
                margin: 0;
                padding: 0;
              }
              
              body {
                display: flex;
                flex-direction: column;
                min-height: 100vh;
                font-family: Arial, sans-serif;
                padding: 40px;
                line-height: 1.6;
                max-width: 800px;
                margin: 0 auto;
                position: relative;
              }

              /* Contenu principal qui pousse le footer vers le bas */
              .content-wrapper {
                flex: 1;
              }

              .header { 
                text-align: center; 
                border-bottom: 2px solid #333; 
                padding-bottom: 20px;
                margin-bottom: 30px;
              }
              
              .company { 
                font-size: 24px; 
                font-weight: bold; 
                color: #2563eb;
                margin-bottom: 10px;
              }
              
              .invoice-title { 
                font-size: 36px; 
                font-weight: bold; 
                color: #333;
                margin: 20px 0;
              }
              
              .info-section { 
                display: grid; 
                grid-template-columns: 1fr 1fr; 
                gap: 30px;
                margin-bottom: 30px;
              }
              
              .info-block p { 
                margin: 8px 0; 
                font-size: 14px;
              }
              
              .services-table { 
                width: 100%; 
                border-collapse: collapse; 
                margin: 30px 0;
              }
              
              .services-table th, .services-table td { 
                border: 1px solid #333; 
                padding: 12px; 
                text-align: left;
              }
              
              .services-table th { 
                background-color: #f8f9fa; 
                font-weight: bold;
              }
              
              .services-table .amount { 
                text-align: right; 
              }
              
              .totals { 
                margin-top: 20px; 
              }
              
              .totals tr { 
                border-top: 1px solid #333; 
              }
              
              .total-final { 
                background-color: #e3f2fd; 
                font-weight: bold; 
                font-size: 16px;
              }
              
              .signature-section { 
                margin-top: 60px; 
                text-align: center;
              }
              
              .signature-line { 
                border-bottom: 2px solid #333; 
                width: 200px; 
                margin: 20px auto;
              }
              
              /* Positionnement fixe en bas de page */
              .footer { 
                position: absolute;
                bottom: 40px;
                left: 0;
                right: 0;
                text-align: center; 
                font-size: 12px; 
                color: #666;
              }
              
              @media print {
                body { 
                  margin: 0; 
                  padding: 20px;
                  display: block;
                  min-height: 100%;
                }
                .footer {
                  position: fixed;
                  bottom: 20px;
                }
              }
            </style>
          </head>
          <body>
            <div class="content-wrapper">
              <div class="header">
                <div class="company">${formData.societe}</div>
                <div class="invoice-title">FACTURE</div>
              </div>
              
              <div class="info-section">
                <div class="info-block">
                  <p><strong>Facture n° :</strong> ${formData.numeroFacture}</p>
                  <p><strong>Date :</strong> ${formData.date}</p>
                </div>
                <div class="info-block">
                  <p><strong>Client :</strong> ${formData.client}</p>
                  <p><strong>ICE :</strong> ${formData.ice}</p>
                </div>
              </div>

              <table class="services-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th style="width: 150px;">Montant (DH)</th>
                  </tr>
                </thead>
                <tbody>
                  ${formData.ligneServices.map(service => `
                    <tr>
                      <td>${service.description}</td>
                      <td class="amount">${parseFloat(service.montant || 0).toFixed(2)}</td>
                    </tr>
                  `).join('')}
                </tbody>
                <tfoot class="totals">
                  <tr>
                    <td style="text-align: right; font-weight: bold;">Total HT</td>
                    <td class="amount" style="font-weight: bold;">${totalHT.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td style="text-align: right; font-weight: bold;">TVA (${formData.tva}%)</td>
                    <td class="amount" style="font-weight: bold;">${montantTVA.toFixed(2)}</td>
                  </tr>
                  <tr class="total-final">
                    <td style="text-align: right; font-weight: bold;">TOTAL TTC</td>
                    <td class="amount" style="font-weight: bold;">${totalTTC.toFixed(2)} DH</td>
                  </tr>
                </tfoot>
              </table>

              ${formData.texteArrete ? `
                <div style="margin: 30px 0;">
                  <p><strong>Arrêtée le présent Facture à la somme de :</strong> ${formData.texteArrete}</p>
                </div>
              ` : ''}

              <div class="signature-section">
                <p><strong>Signature</strong></p>
                <div class="signature-line"></div>
              </div>
            </div> <!-- Fin du content-wrapper -->
            
            <div class="footer">
              <p>CAPITAL: ${formData.capital} ${formData.address ? `ADRESSE: ${formData.address}` : ''} ${formData.IF ? `- IF:${formData.IF}` : ''}
             ${formData.RC ? `RC N°:${formData.RC}` : ''}  ${formData.companyICE ? `ICE: ${formData.companyICE}` : ''} ${formData.TP ? `- TP:${formData.TP}` : ''} ${formData.phone ? `TÉL:${formData.phone}` : ''}</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      setTimeout(() => printWindow.print(), 500);
    };
    generatePDFContent();
};

  const inputStyle = {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    marginBottom: '10px',
    backgroundColor: '#fff'
  };

  const buttonStyle = {
    padding: '12px 24px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    margin: '5px'
  };

  const containerStyle = {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  };

  if (showPreview) {
    return (
      <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        <div style={containerStyle}>
          <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            <button
              onClick={generatePDF}
              style={{
                ...buttonStyle,
                backgroundColor: '#10b981',
                color: 'white',
                fontSize: '16px',
                padding: '15px 30px'
              }}
            >
               Imprimer PDF
            </button>
            <button
              onClick={() => setShowPreview(false)}
              style={{
                ...buttonStyle,
                backgroundColor: '#6b7280',
                color: 'white'
              }}
            >
               Retour
            </button>
          </div>

          {/* Aperçu de la facture */}
          <div style={{ 
            border: '1px solid #ddd', 
            padding: '40px', 
            backgroundColor: 'white',
            fontFamily: 'Arial, sans-serif'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '2px solid #333', paddingBottom: '20px' }}>
              <h2 style={{ color: '#2563eb', fontSize: '24px', margin: '0 0 10px 0' }}>{formData.societe}</h2>
              <h1 style={{ fontSize: '36px', margin: '20px 0', color: '#333' }}>FACTURE</h1>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
              <div>
                <p><strong>Facture n° :</strong> {formData.numeroFacture}</p>
                <p><strong>Date :</strong> {formData.date}</p>
              </div>
              <div>
                <p><strong>Client :</strong> {formData.client}</p>
                <p><strong>ICE :</strong> {formData.ice}</p>
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ border: '1px solid #333', padding: '12px', textAlign: 'left' }}>Description</th>
                  <th style={{ border: '1px solid #333', padding: '12px', textAlign: 'right', width: '150px' }}>Montant (DH)</th>
                </tr>
              </thead>
              <tbody>
                {formData.ligneServices.map((service, index) => (
                  <tr key={index}>
                    <td style={{ border: '1px solid #333', padding: '12px' }}>{service.description}</td>
                    <td style={{ border: '1px solid #333', padding: '12px', textAlign: 'right' }}>
                      {parseFloat(service.montant || 0).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td style={{ border: '1px solid #333', padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>Total HT</td>
                  <td style={{ border: '1px solid #333', padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>{totalHT.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #333', padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>TVA ({formData.tva}%)</td>
                  <td style={{ border: '1px solid #333', padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>{montantTVA.toFixed(2)}</td>
                </tr>
                <tr style={{ backgroundColor: '#e3f2fd' }}>
                  <td style={{ border: '2px solid #333', padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>TOTAL TTC</td>
                  <td style={{ border: '2px solid #333', padding: '12px', textAlign: 'right', fontWeight: 'bold', fontSize: '16px' }}>{totalTTC.toFixed(2)} DH</td>
                </tr>
              </tfoot>
            </table>

            {formData.texteArrete && (
              <p style={{ margin: '20px 0' }}><strong> Arrêtée le présent Facture à la somme de :</strong> {formData.texteArrete}</p>
            )}

            <div style={{ textAlign: 'center', marginTop: '50px' }}>
              <p><strong>Signature</strong></p>
              <div style={{ borderBottom: '2px solid #333', width: '200px', margin: '20px auto' }}></div>
            </div><br />
            <br /><br />
            <br />
            <br />
            <br />
            <br />

            {/* Pied de page avec les informations de la société */}
            <div style={{ textAlign: 'center', marginTop: '30px', fontSize: '12px', color: '#666' }}>
              <p> {formData.capital} {formData.address && `ADRESSE: ${formData.address}`} {formData.IF && `- IF:${formData.IF}`} {formData.RC && `RC N°:${formData.RC}`} {formData.companyICE && `ICE: ${formData.companyICE}`} {formData.TP && `- TP:${formData.TP}`} {formData.phone && `TÉL:${formData.phone}`}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <div style={containerStyle}>
        <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>Générateur de Facture PDF</h2>
        
        {/* Informations générales */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ color: '#333', borderBottom: '2px solid #2563eb', paddingBottom: '10px' }}>Informations générales</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
            <input
              type="text"
              placeholder="Nom de la société"
              value={formData.societe}
              onChange={(e) => handleInputChange('societe', e.target.value)}
              style={inputStyle}
            />
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Numéro de facture"
              value={formData.numeroFacture}
              onChange={(e) => handleInputChange('numeroFacture', e.target.value)}
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Nom du client"
              value={formData.client}
              onChange={(e) => handleInputChange('client', e.target.value)}
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="ICE"
              value={formData.ice}
              onChange={(e) => handleInputChange('ice', e.target.value)}
              style={inputStyle}
            />
            <input
              type="number"
              placeholder="TVA (%)"
              value={formData.tva}
              onChange={(e) => handleInputChange('tva', e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Services */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ color: '#333', borderBottom: '2px solid #2563eb', paddingBottom: '10px' }}>Services</h3>
          {formData.ligneServices.map((service, index) => (
            <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Description du service"
                value={service.description}
                onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
                style={{ ...inputStyle, flex: 1, marginBottom: 0 }}
              />
              <input
                type="number"
                step="0.01"
                placeholder="Montant"
                value={service.montant}
                onChange={(e) => handleServiceChange(index, 'montant', e.target.value)}
                style={{ ...inputStyle, width: '120px', marginBottom: 0 }}
              />
              {formData.ligneServices.length > 1 && (
                <button
                  onClick={() => removeService(index)}
                  style={{
                    ...buttonStyle,
                    backgroundColor: '#ef4444',
                    color: 'white',
                    padding: '12px',
                    margin: 0
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addService}
            style={{
              ...buttonStyle,
              backgroundColor: '#10b981',
              color: 'white'
            }}
          >
            + Ajouter un service
          </button>
        </div>

        {/* Totaux */}
        <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '6px', marginBottom: '30px' }}>
          <h4 style={{ margin: '0 0 15px 0', color: '#333' }}>Récapitulatif</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', textAlign: 'center' }}>
            <div>
              <p style={{ margin: '5px 0', fontWeight: 'bold' }}>Total HT</p>
              <p style={{ margin: '5px 0', fontSize: '18px', color: '#2563eb' }}>{totalHT.toFixed(2)} DH</p>
            </div>
            <div>
              <p style={{ margin: '5px 0', fontWeight: 'bold' }}>TVA ({formData.tva}%)</p>
              <p style={{ margin: '5px 0', fontSize: '18px', color: '#2563eb' }}>{montantTVA.toFixed(2)} DH</p>
            </div>
            <div>
              <p style={{ margin: '5px 0', fontWeight: 'bold' }}>Total TTC</p>
              <p style={{ margin: '5px 0', fontSize: '20px', color: '#10b981', fontWeight: 'bold' }}>{totalTTC.toFixed(2)} DH</p>
            </div>
          </div>
        </div>

        {/* Textes additionnels */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ color: '#333', borderBottom: '2px solid #2563eb', paddingBottom: '10px' }}>Informations complémentaires</h3>
          
          <textarea
            placeholder="Texte de l'arrêté (optionnel)"
            value={formData.texteArrete}
            onChange={(e) => handleInputChange('texteArrete', e.target.value)}
            rows={3}
            style={{ ...inputStyle, resize: 'vertical' }}
          />

          <h4 style={{ margin: '20px 0 10px 0', color: '#333' }}>Informations de la société</h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}> 
            <input
              type="text"
              placeholder="Capital"
              value={formData.capital}
              onChange={(e) => handleInputChange('capital', e.target.value)}
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Adresse"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="IF"
              value={formData.IF}
              onChange={(e) => handleInputChange('IF', e.target.value)}
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="RC"
              value={formData.RC}
              onChange={(e) => handleInputChange('RC', e.target.value)}
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="ICE"
              value={formData.companyICE}
              onChange={(e) => handleInputChange('companyICE', e.target.value)}
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="TP"
              value={formData.TP}
              onChange={(e) => handleInputChange('TP', e.target.value)}
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Téléphone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Boutons d'action */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => setShowPreview(true)}
            style={{
              ...buttonStyle,
              backgroundColor: '#2563eb',
              color: 'white',
              fontSize: '16px',
              padding: '15px 30px'
            }}
          >
             Aperçu de la facture
          </button>
          <button
            onClick={generatePDF}
            style={{
              ...buttonStyle,
              backgroundColor: '#10b981',
              color: 'white',
              fontSize: '16px',
              padding: '15px 30px'
            }}
          >
             Générer PDF directement
          </button>
        </div>
      </div>
</div>
  );
}

export default App;