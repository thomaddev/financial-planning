'use client'
import { useState, useEffect } from 'react'
import { Box, Typography, Button, TextField, Autocomplete, CircularProgress } from '@mui/material'
import Grid from '@mui/material/Grid2'

// Custom Map Click Component
// const MapClickHandler = ({ setLocation }) => {
//   //   useMapEvents({
//   //     click: (e) => {
//   //       setLocation([e.latlng.lat, e.latlng.lng]);
//   //     },
//   //   });
//   return null
// }

interface Step4Props {
  initialTargets: { key: number; target: string }[]
  initialPeriodData: any
  initialLocation: [number, number]
  formMode: string
  onUpdateTargets: (targets: { key: number; target: string }[]) => void
  onUpdatePeriod: (data: object) => void
  onUpdateLocation: (location: [number, number]) => void
}

const Step4: React.FC<Step4Props> = ({
  initialTargets,
  initialPeriodData,
  initialLocation,
  onUpdateTargets,
  onUpdatePeriod,
  onUpdateLocation,
}) => {
  const [targets, setTargets] = useState(initialTargets)
  const [location, setLocation] = useState<[number, number]>(initialLocation)
  const [_searchQuery, setSearchQuery] = useState('')
  const [locationOptions, setLocationOptions] = useState<
    { label: string; lat: number; lon: number }[]
  >([])
  const [loadingLocation, setLoadingLocation] = useState(false)
  //   const markerRef = useRef<L.Marker>(null);

  // Update parent state when local state changes
  useEffect(() => {
    onUpdateTargets(targets)
  }, [targets, onUpdateTargets])

  useEffect(() => {
    onUpdateLocation(location)
  }, [location, onUpdateLocation])

  const addTarget = () => {
    const newTarget = { key: Date.now(), target: '' }
    setTargets([...targets, newTarget])
  }

  const updateTarget = (index: number, value: string) => {
    const updatedTargets = [...targets]
    updatedTargets[index].target = value
    setTargets(updatedTargets)
  }

  const searchLocation = async (value: string) => {
    setSearchQuery(value)
    if (!value) return

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&countrycodes=TH`,
      )
      const data = await response.json()

      if (data.length > 0) {
        setLocationOptions(
          data.map((item: any) => ({
            label: item.display_name,
            lat: parseFloat(item.lat),
            lon: parseFloat(item.lon),
          })),
        )
      }
    } catch (error) {
      console.error('Location search failed', error)
    }
  }

  const handleSelectLocation = (event: any, newValue: any) => {
    if (newValue) {
      setLocation([newValue.lat, newValue.lon])
    }
  }

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.')
      return
    }

    setLoadingLocation(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation: [number, number] = [position.coords.latitude, position.coords.longitude]
        setLocation(newLocation)
        setLoadingLocation(false)
      },
      (error) => {
        console.error('Geolocation error:', error)
        setLoadingLocation(false)
      },
    )
  }

  return (
    <Box py={4}>
      <Grid container spacing={4}>
        {/* Section 1: Target Group */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Typography variant="h5">กลุ่มเป้าหมาย</Typography>
          <Typography variant="body2" color="textSecondary">
            การระบุเป้าหมาย ระบุเป็นประเภทลักษณะและปริมาณให้สอดคล้องกับวัตถุประสงค์
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 7 }}>
          {targets.map((item, index) => (
            <TextField
              key={item.key}
              fullWidth
              margin="dense"
              value={item.target}
              onChange={(e) => updateTarget(index, e.target.value)}
              placeholder="ระบุเป้าหมายโครงการ"
            />
          ))}
          <Button fullWidth variant="contained" color="primary" onClick={addTarget} sx={{ mt: 2 }}>
            ระบุเป้าหมายโครงการ
          </Button>
        </Grid>

        {/* Section 2: Project Duration */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Typography variant="h5">ระยะเวลา</Typography>
          <Typography variant="body2" color="textSecondary">
            เป็นการระบุระยะเวลาตั้งแต่เริ่มต้นโครงการ จนกระทั่งถึงเวลาสิ้นสุดโครงการ
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 7 }}>
          <TextField
            fullWidth
            label="ระบุระยะเวลาโครงการ"
            value={initialPeriodData?.duration || ''}
            onChange={(e) => onUpdatePeriod({ duration: e.target.value })}
          />
        </Grid>

        {/* Section 3: Project Location */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Typography variant="h5">สถานที่ดำเนินการ</Typography>
          <Typography variant="body2" color="textSecondary">
            เป็นการระบุสถานที่ตั้งของโครงการหรือกิจกรรม
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 7 }}>
          <Autocomplete
            options={locationOptions}
            getOptionLabel={(option) => option.label}
            value={
              locationOptions.find((opt) => opt.lat === location[0] && opt.lon === location[1]) ||
              null
            }
            onInputChange={(event, value) => searchLocation(value)}
            onChange={handleSelectLocation}
            renderInput={(params) => <TextField {...params} label="ค้นหาสถานที่..." />}
            sx={{ mb: 2 }}
          />

          <Button
            variant="contained"
            color="secondary"
            onClick={getCurrentLocation}
            disabled={loadingLocation}
            sx={{ mb: 2 }}
          >
            {loadingLocation ? <CircularProgress size={20} sx={{ mr: 1 }} /> : 'ใช้ตำแหน่งปัจจุบัน'}
          </Button>

          {/* <MapContainer center={location} zoom={16} style={{ height: "400px", width: "100%" }}>
            <TileLayer url="https://mt.google.com/vt/lyrs=m&x={x}&y={y}&z={z}" />
            <Marker position={location} ref={markerRef} />
            <MapClickHandler setLocation={setLocation} />
          </MapContainer> */}
        </Grid>
      </Grid>
    </Box>
  )
}

export default Step4
