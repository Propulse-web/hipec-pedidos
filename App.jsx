import React, { useState } from 'react';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentVendor, setCurrentVendor] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);

  // EDITA AQUI TUS USUARIOS
  const usuarios = {
    'juan': { password: '1234', nombre: 'Juan García' },
    'maria': { password: '5678', nombre: 'María López' },
    'carlos': { password: 'pass123', nombre: 'Carlos Rodríguez' },
    'ana': { password: '9999', nombre: 'Ana Martinez' },
  };

  const cargarDatos = async (vendedor) => {
    setLoading(true);
    try {
      const response = await fetch(
        'https://docs.google.com/spreadsheets/d/e/2PACX-1vRu1GrwOg8hXB7RP6SUyeT0b5ceMWsKZ-6axPjYZtbLRroo1XF4OqpomphsMTgug44vg-kOu_Fa9l3T/gviz/tq?tqx=out:json&sheet=base de Pedidos'
      );
      const text = await response.text();
      const jsonMatch = text.match(/\)\]\'\n(.*)\n/s);
      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[1]);
        const pedidosFiltrados = [];
        if (data.table && data.table.rows) {
          data.table.rows.forEach(row => {
            const cells = row.c;
            if (cells && cells.length > 0) {
              const vendedorCell = cells[3]?.v;
              if (vendedorCell && vendedorCell.toLowerCase().includes(vendedor.toLowerCase())) {
                pedidosFiltrados.push({
                  nCL: cells[0]?.v || '',
                  cliente: cells[1]?.v || '',
                  fechaEntrega: cells[2]?.v || '',
                  cumplimiento: cells[4]?.v || '',
                  plazoTotal: cells[5]?.v || '',
                  remitoAsociado: cells[6]?.v || ''
                });
              }
            }
          });
        }
        setPedidos(pedidosFiltrados);
      }
    } catch (error) {
      mostrarDatosDemo(vendedor);
    }
    setLoading(false);
  };

  const mostrarDatosDemo = (vendedor) => {
    const datosDemo = {
      'juan': [
        { nCL: '001', cliente: 'Empresa ABC', fechaEntrega: '2025-01-15', cumplimiento: 'Si', plazoTotal: '5 días', remitoAsociado: 'REM-001' },
        { nCL: '005', cliente: 'Cliente XYZ', fechaEntrega: '2025-01-18', cumplimiento: 'Si', plazoTotal: '7 días', remitoAsociado: 'REM-005' },
      ],
      'maria': [
        { nCL: '002', cliente: 'Distribuidor BR', fechaEntrega: '2025-01-16', cumplimiento: 'No', plazoTotal: '6 días', remitoAsociado: 'REM-002' },
        { nCL: '003', cliente: 'Retail Plus', fechaEntrega: '2025-01-17', cumplimiento: 'Si', plazoTotal: '8 días', remitoAsociado: 'REM-003' },
      ],
      'carlos': [
        { nCL: '004', cliente: 'Megastore', fechaEntrega: '2025-01-19', cumplimiento: 'Si', plazoTotal: '10 días', remitoAsociado: 'REM-004' },
      ],
      'ana': [
        { nCL: '006', cliente: 'Tienda Local', fechaEntrega: '2025-01-20', cumplimiento: 'Si', plazoTotal: '4 días', remitoAsociado: 'REM-006' },
      ],
    };
    setPedidos(datosDemo[vendedor] || []);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    const user = usuarios[username];
    if (user && user.password === password) {
      setCurrentVendor(username);
      setLoggedIn(true);
      setUsername('');
      setPassword('');
      await cargarDatos(username);
    } else {
      setLoginError('Usuario o contraseña incorrectos');
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setCurrentVendor('');
    setPedidos([]);
    setUsername('');
    setPassword('');
    setLoginError('');
  };

  if (!loggedIn) {
    return (
      <div style={{ minHeight: '100vh', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #ddd', padding: '2rem', maxWidth: '400px', width: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '40px', marginBottom: '1rem' }}>📦</div>
            <h1 style={{ fontSize: '24px', fontWeight: '600', margin: '0 0 8px' }}>HIPEC</h1>
            <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>Seguimiento de Pedidos</p>
          </div>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>Usuario</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingresa tu usuario"
                style={{ width: '100%', boxSizing: 'border-box', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                style={{ width: '100%', boxSizing: 'border-box', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' }}
              />
            </div>

            {loginError && (
              <div style={{ background: '#ffcdd2', border: '1px solid #ef5350', borderRadius: '8px', padding: '10px', marginBottom: '1rem', fontSize: '13px', color: '#c62828' }}>
                {loginError}
              </div>
            )}

            <button type="submit" style={{ width: '100%', padding: '10px', background: '#1976d2', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
              Iniciar sesión
            </button>
          </form>

          <div style={{ borderTop: '1px solid #ddd', paddingTop: '1rem', marginTop: '1rem' }}>
            <p style={{ fontSize: '12px', color: '#666', margin: '0 0 0.5rem', fontWeight: '600' }}>Demo:</p>
            <ul style={{ fontSize: '12px', color: '#666', margin: 0, paddingLeft: '20px' }}>
              <li>juan / 1234</li>
              <li>maria / 5678</li>
              <li>carlos / pass123</li>
              <li>ana / 9999</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', padding: '20px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '600', margin: 0 }}>📦 Mis Pedidos</h1>
            <p style={{ fontSize: '14px', color: '#666', margin: '4px 0 0' }}>
              Bienvenido, <strong>{usuarios[currentVendor]?.nombre}</strong>
            </p>
          </div>
          <button
            onClick={handleLogout}
            style={{ padding: '8px 16px', background: 'white', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}
          >
            Cerrar sesión
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '2rem' }}>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <p style={{ fontSize: '13px', color: '#666', margin: '0 0 8px' }}>Total de pedidos</p>
            <p style={{ fontSize: '28px', fontWeight: '600', color: '#1976d2', margin: 0 }}>{pedidos.length}</p>
          </div>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <p style={{ fontSize: '13px', color: '#666', margin: '0 0 8px' }}>Cumplimiento</p>
            <p style={{ fontSize: '28px', fontWeight: '600', color: '#388e3c', margin: 0 }}>
              {Math.round((pedidos.filter(p => p.cumplimiento === 'Si').length / (pedidos.length || 1) * 100))}%
            </p>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <p style={{ color: '#666' }}>Cargando pedidos...</p>
          </div>
        ) : pedidos.length > 0 ? (
          <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ background: '#f5f5f5', borderBottom: '1px solid #ddd' }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>N CL.</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Cliente</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Fecha Entrega</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Cumplimiento</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Plazo Total</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Remito</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.map((pedido, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '12px' }}><strong>{pedido.nCL}</strong></td>
                      <td style={{ padding: '12px' }}>{pedido.cliente}</td>
                      <td style={{ padding: '12px' }}>{pedido.fechaEntrega}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ 
                          padding: '4px 12px', 
                          borderRadius: '6px', 
                          fontSize: '12px',
                          fontWeight: '600',
                          background: pedido.cumplimiento === 'Si' ? '#c8e6c9' : '#ffcdd2',
                          color: pedido.cumplimiento === 'Si' ? '#2e7d32' : '#c62828'
                        }}>
                          {pedido.cumplimiento}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>{pedido.plazoTotal}</td>
                      <td style={{ padding: '12px', color: '#1976d2' }}>{pedido.remitoAsociado}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem', background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <p style={{ color: '#666' }}>No hay pedidos disponibles</p>
          </div>
        )}
      </div>
    </div>
  );
}
