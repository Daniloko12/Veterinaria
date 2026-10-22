import { regiones } from '../../datos/datosIniciales'
import CampoSelect from './CampoSelect'

interface SelectorRegionComunaProps {
  region: string
  comuna: string
  /** Al cambiar la region tambien se limpia la comuna */
  alCambiarRegion: (region: string) => void
  alCambiarComuna: (comuna: string) => void
  errorRegion?: string
  errorComuna?: string
  prefijoId?: string
  deshabilitado?: boolean
}

// Selects dependientes: las comunas cambian segun la region elegida
function SelectorRegionComuna({
  region,
  comuna,
  alCambiarRegion,
  alCambiarComuna,
  errorRegion,
  errorComuna,
  prefijoId = '',
  deshabilitado = false,
}: SelectorRegionComunaProps) {
  const comunas = regiones.find((item) => item.nombre === region)?.comunas ?? []

  function cambiarRegion(nuevaRegion: string) {
    alCambiarRegion(nuevaRegion)
    alCambiarComuna('')
  }

  return (
    <div className="row">
      <div className="col-md-6">
        <CampoSelect
          id={`${prefijoId}region`}
          etiqueta="Región"
          valor={region}
          alCambiar={cambiarRegion}
          opciones={regiones.map((item) => ({ valor: item.nombre, texto: item.nombre }))}
          textoVacio="Seleccione una región"
          error={errorRegion}
          requerido
          deshabilitado={deshabilitado}
        />
      </div>
      <div className="col-md-6">
        <CampoSelect
          id={`${prefijoId}comuna`}
          etiqueta="Comuna"
          valor={comuna}
          alCambiar={alCambiarComuna}
          opciones={comunas.map((item) => ({ valor: item, texto: item }))}
          textoVacio="Seleccione una comuna"
          error={errorComuna}
          requerido
          deshabilitado={deshabilitado || comunas.length === 0}
        />
      </div>
    </div>
  )
}

export default SelectorRegionComuna
