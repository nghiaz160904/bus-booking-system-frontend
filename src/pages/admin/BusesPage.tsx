/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Stack,
  Typography,
  TextField,
  CircularProgress,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Popover,
  Switch,
  FormControlLabel,
  Tooltip,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import {
  Add,
  Edit,
  Delete,
  DirectionsBus,
  Visibility,
  EventSeat,
  CheckBoxOutlineBlank,
  EditAttributes,
} from '@mui/icons-material';
import { useBuses, useMutateBus, useBus } from '@/hooks/admin/useBuses';
import { useOperators } from '@/hooks/admin/useOperators';
import type { Bus, BusType, SeatDefinition } from '@/types/AdminTypes';

// --- CONSTANTS ---
const MAX_ROWS = 12;
const MAX_COLS = 5;

// --- TYPES ---
interface CellData {
  isSeat: boolean;
  code: string;
}

type ToolMode = 'SEAT' | 'PATH' | 'EDIT';

// Helper: Generate a completely empty layout (all paths)
const generateEmptyLayout = (decks: number, rows: number, cols: number): CellData[][][] => {
  return Array(decks)
    .fill(0)
    .map(() =>
      Array(rows)
        .fill(0)
        .map(() =>
          Array(cols)
            .fill(0)
            .map(() => ({
              isSeat: false,
              code: '',
            })),
        ),
    );
};

// Helper: Generate default layout (all seats) for NEW buses
const generateDefaultLayout = (decks: number, rows: number, cols: number): CellData[][][] => {
  return Array(decks)
    .fill(0)
    .map((_, dIndex) =>
      Array(rows)
        .fill(0)
        .map((_, rIndex) =>
          Array(cols)
            .fill(0)
            .map((_, cIndex) => {
              const prefix = dIndex === 0 ? 'A' : 'B';
              const seatNum = rIndex * cols + cIndex + 1;
              return {
                isSeat: true,
                code: `${prefix}${seatNum.toString().padStart(2, '0')}`,
              };
            }),
        ),
    );
};

export default function BusesPage() {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [viewMode, setViewMode] = useState(false);

  // --- FORM STATE ---
  const [formData, setFormData] = useState<Partial<Bus & { operatorId: string }>>({
    type: 'SLEEPER',
    seatCapacity: 40,
  });

  // --- SEAT MAP CONFIG STATE ---
  const [configDecks, setConfigDecks] = useState(1);
  const [configRows, setConfigRows] = useState(6);
  const [configCols, setConfigCols] = useState(3);
  const [seatLayout, setSeatLayout] = useState<CellData[][][]>([]);

  // --- TOOL STATE ---
  const [toolMode, setToolMode] = useState<ToolMode>('SEAT');

  // --- POPOVER STATE (For Cell Editing) ---
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const [editingCell, setEditingCell] = useState<{ d: number; r: number; c: number } | null>(null);
  const [tempCellData, setTempCellData] = useState<CellData>({ isSeat: false, code: '' });

  // --- QUERIES ---
  const { data: buses = [], isLoading: loadingBuses } = useBuses();
  const { data: operators = [] } = useOperators();
  const { data: busDetail, isLoading: loadingDetail } = useBus(editingId || '');

  // --- MUTATIONS ---
  const { create, update, delete: remove, saveSeatMap } = useMutateBus();

  // --- EFFECTS ---
  useEffect(() => {
    // Reset layout for new bus
    if (!editingId && open && !viewMode) {
      setSeatLayout(generateDefaultLayout(configDecks, configRows, configCols));
    }
  }, [configDecks, configRows, configCols, editingId, open, viewMode]);

  useEffect(() => {
    // Parse existing bus data
    if (editingId && busDetail && open) {
      setFormData({
        operatorId: busDetail.operatorId,
        plateNumber: busDetail.plateNumber,
        model: busDetail.model,
        type: busDetail.type,
        seatCapacity: busDetail.seatCapacity,
      });

      const seats = (busDetail as any).seats || [];
      if (seats.length > 0) {
        const maxDeck = Math.max(...seats.map((s: any) => s.deckNumber || s.deck || 1));
        const maxRow = Math.max(...seats.map((s: any) => s.gridRow || s.row || 1));
        const maxCol = Math.max(...seats.map((s: any) => s.gridCol || s.col || 1));

        setConfigDecks(maxDeck);
        setConfigRows(maxRow);
        setConfigCols(maxCol);

        const newLayout = generateEmptyLayout(maxDeck, maxRow, maxCol);
        seats.forEach((s: any) => {
          const d = (s.deckNumber || s.deck || 1) - 1;
          const r = (s.gridRow || s.row || 1) - 1;
          const c = (s.gridCol || s.col || 1) - 1;
          if (newLayout[d]?.[r]?.[c]) {
            newLayout[d][r][c] = { isSeat: true, code: s.seatCode };
          }
        });
        setSeatLayout(newLayout);
      } else {
        setSeatLayout(generateEmptyLayout(1, 6, 3));
      }
    }
  }, [busDetail, editingId, open]);

  // --- HANDLERS ---

  const handleOpen = (bus?: Bus, isViewOnly = false) => {
    setViewMode(isViewOnly);
    if (bus) {
      setEditingId(bus.id);
      setActiveStep(isViewOnly ? 1 : 0);
    } else {
      setEditingId(null);
      setFormData({ type: 'SLEEPER', seatCapacity: 0 });
      setConfigDecks(1);
      setConfigRows(6);
      setConfigCols(3);
      setActiveStep(0);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({});
    setEditingId(null);
    setActiveStep(0);
    setViewMode(false);
    setAnchorEl(null);
    setToolMode('SEAT');
  };

  // --- CELL CLICK LOGIC ---

  const handleCellClick = (
    event: React.MouseEvent<HTMLDivElement>,
    d: number,
    r: number,
    c: number,
  ) => {
    if (viewMode) return;

    // 1. Edit Mode: Open Popover ONLY if it is a Seat
    if (toolMode === 'EDIT') {
      if (!seatLayout[d][r][c].isSeat) return; // Do nothing on paths in Edit Code mode

      setEditingCell({ d, r, c });
      setTempCellData(seatLayout[d][r][c]);
      setAnchorEl(event.currentTarget);
      return;
    }

    // 2. Paint Mode (Seat or Path): Apply immediately
    const newLayout = JSON.parse(JSON.stringify(seatLayout)); // Deep copy
    const targetCell = newLayout[d][r][c];

    if (toolMode === 'PATH') {
      targetCell.isSeat = false;
      targetCell.code = '';
    } else if (toolMode === 'SEAT') {
      targetCell.isSeat = true;
      // If it doesn't have a code, generate a default one
      if (!targetCell.code) {
        const prefix = d === 0 ? 'A' : 'B';
        const seatNum = r * configCols + c + 1;
        targetCell.code = `${prefix}${seatNum.toString().padStart(2, '0')}`;
      }
    }
    setSeatLayout(newLayout);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setEditingCell(null);
  };

  const saveCellChanges = () => {
    if (!editingCell) return;
    const { d, r, c } = editingCell;
    const newLayout = [...seatLayout];
    newLayout[d][r][c] = tempCellData; // Apply changes from popover
    setSeatLayout(newLayout);
    handlePopoverClose();
  };

  const calculateTotalSeats = () => {
    let count = 0;
    seatLayout.forEach((deck) =>
      deck.forEach((row) =>
        row.forEach((cell) => {
          if (cell.isSeat) count++;
        }),
      ),
    );
    return count;
  };

  const generateSeatDefinitions = (): SeatDefinition[] => {
    const definitions: SeatDefinition[] = [];
    seatLayout.forEach((deck, dIndex) => {
      deck.forEach((row, rIndex) => {
        row.forEach((cell, cIndex) => {
          if (cell.isSeat) {
            definitions.push({
              seatCode: cell.code,
              row: rIndex + 1,
              col: cIndex + 1,
              deck: dIndex + 1,
              isAvailable: true,
            });
          }
        });
      });
    });
    return definitions;
  };

  const handleSubmit = async () => {
    if (!formData.operatorId) {
      alert('Please select an operator');
      return;
    }
    try {
      const payload: any = { ...formData, operator: undefined };

      if (editingId && !viewMode) {
        await update.mutateAsync({ id: editingId, data: payload });
        const seatDefinitions = generateSeatDefinitions();
        if (seatDefinitions.length > 0) {
          await saveSeatMap.mutateAsync({ busId: editingId, seats: seatDefinitions });
        }
        handleClose();
      } else if (!editingId) {
        payload.seatCapacity = calculateTotalSeats();
        const newBus = await create.mutateAsync(payload);
        const seatDefinitions = generateSeatDefinitions();
        if (seatDefinitions.length > 0) {
          await saveSeatMap.mutateAsync({ busId: newBus.id, seats: seatDefinitions });
        }
        handleClose();
      }
    } catch (error) {
      console.error('Failed to save bus', error);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this bus?')) remove.mutate(id);
  };

  // --- RENDERERS ---

  const renderSeatGrid = (deckIndex: number) => (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Deck {deckIndex + 1}
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(${configCols}, 1fr)`,
          gap: 1,
          maxWidth: `${configCols * 60}px`,
        }}
      >
        {seatLayout[deckIndex]?.map((row, rIndex) =>
          row.map((cell, cIndex) => (
            <Tooltip
              title={
                viewMode
                  ? `Seat: ${cell.code}`
                  : toolMode === 'EDIT'
                    ? cell.isSeat
                      ? 'Click to Edit Code'
                      : ''
                    : `Click to set ${toolMode}`
              }
              key={`${deckIndex}-${rIndex}-${cIndex}`}
            >
              <Paper
                elevation={cell.isSeat ? 3 : 0}
                onClick={(e) => handleCellClick(e, deckIndex, rIndex, cIndex)}
                sx={{
                  height: 45,
                  width: 45,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  // In EDIT mode, pointer only shows on Seats
                  cursor: viewMode
                    ? 'default'
                    : toolMode === 'EDIT' && !cell.isSeat
                      ? 'default'
                      : 'pointer',
                  bgcolor: cell.isSeat ? 'primary.main' : 'action.hover',
                  color: cell.isSeat ? 'white' : 'text.disabled',
                  border: cell.isSeat ? 'none' : '1px dashed #ccc',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  userSelect: 'none',
                  transition: 'all 0.1s',
                  '&:hover': {
                    opacity: viewMode || (toolMode === 'EDIT' && !cell.isSeat) ? 1 : 0.8,
                  },
                }}
              >
                {cell.isSeat ? cell.code : ''}
              </Paper>
            </Tooltip>
          )),
        )}
      </Box>
    </Box>
  );

  const columns: GridColDef[] = [
    { field: 'plateNumber', headerName: 'Plate Number', width: 150 },
    {
      field: 'operatorName',
      headerName: 'Operator',
      width: 200,
    },
    { field: 'type', headerName: 'Type', width: 130 },
    { field: 'seatCapacity', headerName: 'Seats', type: 'number', width: 100 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 160,
      renderCell: (params) => (
        <Stack direction="row">
          <Tooltip title="View Layout">
            <IconButton size="small" color="info" onClick={() => handleOpen(params.row, true)}>
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Info">
            <IconButton size="small" onClick={() => handleOpen(params.row, false)}>
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <IconButton size="small" color="error" onClick={() => handleDelete(params.row.id)}>
            <Delete fontSize="small" />
          </IconButton>
        </Stack>
      ),
    },
  ];

  if (loadingBuses) return <CircularProgress sx={{ m: 4 }} />;

  return (
    <Box sx={{ height: '100%', width: '100%', p: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <DirectionsBus /> Fleet Management
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
          Add Bus
        </Button>
      </Stack>

      <DataGrid rows={buses} columns={columns} autoHeight sx={{ bgcolor: 'white' }} />

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {viewMode ? 'View Bus Details' : editingId ? 'Edit Bus Info' : 'Add New Bus'}
        </DialogTitle>

        {!editingId && !viewMode && (
          <Box sx={{ px: 3, py: 1 }}>
            <Stepper activeStep={activeStep}>
              <Step>
                <StepLabel>Basic Info</StepLabel>
              </Step>
              <Step>
                <StepLabel>Seat Layout</StepLabel>
              </Step>
            </Stepper>
          </Box>
        )}

        <DialogContent dividers>
          {loadingDetail && editingId ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {activeStep === 0 && (
                <Stack spacing={2} sx={{ mt: 1 }}>
                  <FormControl fullWidth disabled={viewMode || !!editingId}>
                    <InputLabel>Operator</InputLabel>
                    <Select
                      value={formData.operatorId || ''}
                      label="Operator"
                      onChange={(e) => setFormData({ ...formData, operatorId: e.target.value })}
                    >
                      {operators.map((op) => (
                        <MenuItem key={op.id} value={op.id}>
                          {op.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    label="Plate Number"
                    fullWidth
                    disabled={viewMode}
                    value={formData.plateNumber || ''}
                    onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
                  />
                  <TextField
                    label="Model"
                    fullWidth
                    disabled={viewMode}
                    value={formData.model || ''}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  />
                  <Stack direction="row" spacing={2}>
                    <FormControl fullWidth disabled={viewMode}>
                      <InputLabel>Type</InputLabel>
                      <Select
                        value={formData.type || 'SLEEPER'}
                        label="Type"
                        onChange={(e) =>
                          setFormData({ ...formData, type: e.target.value as BusType })
                        }
                      >
                        <MenuItem value="SLEEPER">Sleeper</MenuItem>
                        <MenuItem value="LIMOUSINE">Limousine</MenuItem>
                        <MenuItem value="SEATER">Seater</MenuItem>
                        <MenuItem value="VIP">VIP</MenuItem>
                      </Select>
                    </FormControl>
                    {editingId && (
                      <TextField
                        label="Capacity"
                        type="number"
                        disabled
                        fullWidth
                        value={formData.seatCapacity}
                      />
                    )}
                  </Stack>
                </Stack>
              )}

              {activeStep === 1 && (
                <Stack spacing={3} sx={{ mt: 1 }}>
                  {!editingId && !viewMode && (
                    <Grid container spacing={2} alignItems="center">
                      <Grid size={{ xs: 4 }}>
                        <TextField
                          label="Decks"
                          type="number"
                          size="small"
                          fullWidth
                          inputProps={{ min: 1, max: 2 }}
                          value={configDecks}
                          onChange={(e) => setConfigDecks(Number(e.target.value))}
                        />
                      </Grid>
                      <Grid size={{ xs: 4 }}>
                        <TextField
                          label="Rows"
                          type="number"
                          size="small"
                          fullWidth
                          inputProps={{ min: 2, max: MAX_ROWS }}
                          value={configRows}
                          onChange={(e) => setConfigRows(Number(e.target.value))}
                        />
                      </Grid>
                      <Grid size={{ xs: 4 }}>
                        <TextField
                          label="Cols"
                          type="number"
                          size="small"
                          fullWidth
                          inputProps={{ min: 2, max: MAX_COLS }}
                          value={configCols}
                          onChange={(e) => setConfigCols(Number(e.target.value))}
                        />
                      </Grid>
                    </Grid>
                  )}

                  {!viewMode && (
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <ToggleButtonGroup
                        value={toolMode}
                        exclusive
                        onChange={(_, newMode) => {
                          if (newMode) setToolMode(newMode);
                        }}
                        size="small"
                        color="primary"
                      >
                        <ToggleButton value="PATH" sx={{ gap: 1, px: 2 }}>
                          <CheckBoxOutlineBlank fontSize="small" /> Path
                        </ToggleButton>
                        <ToggleButton value="SEAT" sx={{ gap: 1, px: 2 }}>
                          <EventSeat fontSize="small" /> Seat
                        </ToggleButton>
                        <ToggleButton value="EDIT" sx={{ gap: 1, px: 2 }}>
                          <EditAttributes fontSize="small" /> Edit Code
                        </ToggleButton>
                      </ToggleButtonGroup>
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap' }}>
                    {seatLayout.length > 0 ? (
                      seatLayout.map((_, index) => <div key={index}>{renderSeatGrid(index)}</div>)
                    ) : (
                      <Typography>No seat map data available.</Typography>
                    )}
                  </Box>

                  {!viewMode && (
                    <Typography align="center" variant="caption" color="text.secondary">
                      Select a tool above and click cells to configure.
                      <br />
                      Total Capacity: <b>{calculateTotalSeats()}</b>
                    </Typography>
                  )}
                </Stack>
              )}
            </>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>{viewMode ? 'Close' : 'Cancel'}</Button>
          {!editingId && !viewMode && (
            <>
              {activeStep === 0 ? (
                <Button variant="contained" onClick={() => setActiveStep(1)}>
                  Next: Config Seats
                </Button>
              ) : (
                <>
                  <Button onClick={() => setActiveStep(0)}>Back</Button>
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={create.isPending || saveSeatMap.isPending}
                  >
                    {create.isPending ? 'Creating...' : 'Create Bus & Map'}
                  </Button>
                </>
              )}
            </>
          )}
          {editingId && !viewMode && (
            <Button onClick={handleSubmit} variant="contained" disabled={update.isPending}>
              Update
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Box sx={{ p: 2, minWidth: 200 }}>
          <Typography variant="subtitle2" gutterBottom>
            {/* Dynamic Title based on Tool Mode */}
            {toolMode === 'EDIT' ? 'Edit Seat Code' : 'Configure Cell'}
          </Typography>

          {/* Hide Switch if in EDIT mode (Restriction enforced) */}
          {toolMode !== 'EDIT' && (
            <FormControlLabel
              control={
                <Switch
                  checked={tempCellData.isSeat}
                  onChange={(e) => setTempCellData({ ...tempCellData, isSeat: e.target.checked })}
                />
              }
              label={tempCellData.isSeat ? 'Type: Seat' : 'Type: Path'}
              sx={{ mb: 2, display: 'block' }}
            />
          )}

          {tempCellData.isSeat && (
            <TextField
              label="Seat Code"
              size="small"
              fullWidth
              autoFocus
              value={tempCellData.code}
              onChange={(e) => setTempCellData({ ...tempCellData, code: e.target.value })}
              onFocus={(e) => e.target.select()} // Select all text on focus for easy overwrite
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveCellChanges();
              }}
              helperText="e.g. A01"
            />
          )}
          <Button
            fullWidth
            variant="contained"
            size="small"
            sx={{ mt: 2 }}
            onClick={saveCellChanges}
          >
            Apply
          </Button>
        </Box>
      </Popover>
    </Box>
  );
}
