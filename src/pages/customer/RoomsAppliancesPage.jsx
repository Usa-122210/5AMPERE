import { useState, useEffect } from 'react';
import {
  Cpu,
  Plus,
  Trash2,
  Edit2,
  Power,
  Home,
  Check,
  X,
} from 'lucide-react';
import { Surface } from '../../components/ui/Surface';
import { Button } from '../../components/ui/Button';
import { PageHeader } from '../../components/common/PageHeader';
import { useAuth } from '../../context/AuthContext';

export function RoomsAppliancesPage() {
  const { activeCustomerProperty, updatePropertyRooms, toggleApplianceState, addApplianceToRoom } = useAuth();

  const property = activeCustomerProperty || {};
  const isResidential = property.propertyType === 'home';
  const rooms = property.rooms || [];

  // Active filter tab: 'all' or roomId
  const [selectedRoomId, setSelectedRoomId] = useState('all');

  // Add Room Modal State
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomType, setNewRoomType] = useState('other');

  // Add Appliance Modal State
  const [isAddAppOpen, setIsAddAppOpen] = useState(false);
  const [targetRoomForApp, setTargetRoomForApp] = useState(rooms[0]?.id || '');
  const [newAppName, setNewAppName] = useState('');
  const [newAppWattage, setNewAppWattage] = useState('1500');
  const [newAppPriority, setNewAppPriority] = useState('Standard');
  const [newAppControl, setNewAppControl] = useState(true);
  const [newAppCircuit, setNewAppCircuit] = useState('MCB Breaker 16A');

  // Rename Room State
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [editedRoomName, setEditedRoomName] = useState('');

  useEffect(() => {
    setSelectedRoomId('all');
    setTargetRoomForApp(rooms[0]?.id || '');
  }, [property.id]);

  // Total metrics across rooms
  let totalActiveWatts = 0;
  let totalApplianceCount = 0;
  let activeApplianceCount = 0;

  rooms.forEach((r) => {
    (r.appliances || []).forEach((a) => {
      totalApplianceCount += 1;
      if (a.active) {
        activeApplianceCount += 1;
        totalActiveWatts += (a.drawKw || 0.1) * 1000;
      }
    });
  });

  const filteredRooms = selectedRoomId === 'all'
    ? rooms
    : rooms.filter((r) => r.id === selectedRoomId);

  // Handlers
  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;

    const newRoom = {
      id: `room-${Date.now().toString().slice(-4)}`,
      name: newRoomName.trim(),
      type: newRoomType,
      appliances: [],
    };

    updatePropertyRooms(property.id, [...rooms, newRoom]);
    setNewRoomName('');
    setIsAddRoomOpen(false);
    setSelectedRoomId(newRoom.id);
    setTargetRoomForApp(newRoom.id);
  };

  const handleDeleteRoom = (roomId) => {
    if (confirm('Are you sure you want to remove this room and its assigned appliances?')) {
      const updated = rooms.filter((r) => r.id !== roomId);
      updatePropertyRooms(property.id, updated);
      if (selectedRoomId === roomId) setSelectedRoomId('all');
    }
  };

  const handleStartRename = (room) => {
    setEditingRoomId(room.id);
    setEditedRoomName(room.name);
  };

  const handleSaveRename = (roomId) => {
    if (!editedRoomName.trim()) return;
    const updated = rooms.map((r) => (r.id === roomId ? { ...r, name: editedRoomName.trim() } : r));
    updatePropertyRooms(property.id, updated);
    setEditingRoomId(null);
  };

  const handleCreateAppliance = (e) => {
    e.preventDefault();
    if (!newAppName.trim()) return;

    const resolvedRoomId = rooms.some((r) => r.id === targetRoomForApp)
      ? targetRoomForApp
      : rooms[0]?.id;
    if (!resolvedRoomId) return;

    const newApp = {
      id: `app-${Date.now().toString().slice(-4)}`,
      name: newAppName.trim(),
      drawKw: Number(newAppWattage) / 1000,
      active: true,
      controlEnabled: newAppControl,
      priority: newAppPriority,
      circuit: newAppCircuit,
    };

    addApplianceToRoom(property.id, resolvedRoomId, newApp);
    setNewAppName('');
    setIsAddAppOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        category={isResidential ? 'Household Topology' : 'Facility Zones & Equipment'}
        title={isResidential ? 'Rooms & Appliances' : 'Zones & Electrical Loads'}
        badge={property.propertyName || 'Property Topology'}
        badgeColor="var(--color-accent)"
        description={
          isResidential
            ? 'Manage room-wise electrical circuits, monitor individual appliance wattage, and control sheddable contactors.'
            : 'Inspect facility zones, monitor major equipment electrical draw, and manage automated peak load shedding.'
        }
      >
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsAddRoomOpen(true)}
            className="text-xs"
          >
            <Plus size={13} />
            <span>{isResidential ? 'Add Room' : 'Add Zone'}</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              if (rooms.length > 0) setTargetRoomForApp(rooms[0].id);
              setIsAddAppOpen(true);
            }}
            className="text-xs font-bold shadow-xs"
            disabled={rooms.length === 0}
          >
            <Plus size={13} />
            <span>Add Appliance / Load</span>
          </Button>
        </div>
      </PageHeader>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Surface variant="primary" padding="md" className="border border-(--color-border)">
          <span className="text-[10px] font-mono uppercase text-(--color-text-muted) block">
            {isResidential ? 'Configured Rooms' : 'Facility Zones'}
          </span>
          <span className="text-xl font-bold font-mono text-(--color-text)">
            {rooms.length}
          </span>
        </Surface>

        <Surface variant="primary" padding="md" className="border border-(--color-border)">
          <span className="text-[10px] font-mono uppercase text-(--color-text-muted) block">
            Monitored Appliances
          </span>
          <span className="text-xl font-bold font-mono text-(--color-text)">
            {totalApplianceCount}
          </span>
        </Surface>

        <Surface variant="primary" padding="md" className="border border-(--color-border)">
          <span className="text-[10px] font-mono uppercase text-(--color-text-muted) block">
            Currently Running
          </span>
          <span className="text-xl font-bold font-mono text-(--color-success)">
            {activeApplianceCount}
          </span>
        </Surface>

        <Surface variant="primary" padding="md" className="border border-(--color-border)">
          <span className="text-[10px] font-mono uppercase text-(--color-text-muted) block">
            Active Load
          </span>
          <span className="text-xl font-bold font-mono text-(--color-accent)">
            {(totalActiveWatts / 1000).toFixed(2)} kW
          </span>
        </Surface>
      </div>

      {/* Room / Zone Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-(--color-border)">
        <button
          type="button"
          onClick={() => setSelectedRoomId('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
            selectedRoomId === 'all'
              ? 'bg-(--color-surface-selected) text-(--color-accent) font-bold border border-(--color-accent)'
              : 'text-(--color-text-secondary) hover:text-(--color-text)'
          }`}
        >
          All {isResidential ? 'Rooms' : 'Zones'} ({rooms.length})
        </button>

        {rooms.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setSelectedRoomId(r.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
              selectedRoomId === r.id
                ? 'bg-(--color-surface-selected) text-(--color-accent) font-bold border border-(--color-accent)'
                : 'text-(--color-text-secondary) hover:text-(--color-text)'
            }`}
          >
            <span>{r.name}</span>
            <span className="ml-1.5 text-[10px] opacity-75 font-mono">
              ({r.appliances?.length || 0})
            </span>
          </button>
        ))}
      </div>

      {/* Empty State */}
      {rooms.length === 0 ? (
        <Surface variant="primary" padding="xl" className="border border-dashed border-(--color-border) text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-(--color-surface-secondary) text-(--color-accent) flex items-center justify-center mx-auto">
            <Cpu size={24} />
          </div>
          <h3 className="text-sm font-bold text-(--color-text)">
            No {isResidential ? 'Rooms' : 'Zones'} Configured Yet
          </h3>
          <p className="text-xs text-(--color-text-secondary) max-w-sm mx-auto">
            Organise your electricity monitoring by adding rooms (e.g., Living Room, Kitchen) or electrical circuits.
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddRoomOpen(true)}
            className="text-xs font-bold"
          >
            <Plus size={13} />
            <span>Create First {isResidential ? 'Room' : 'Zone'}</span>
          </Button>
        </Surface>
      ) : (
        /* Rooms Grid */
        <div className="space-y-6">
          {filteredRooms.map((room) => {
            const roomActiveWatts = (room.appliances || [])
              .filter((a) => a.active)
              .reduce((sum, a) => sum + (a.drawKw || 0.1) * 1000, 0);

            return (
              <Surface
                key={room.id}
                variant="primary"
                padding="lg"
                className="border border-(--color-border) space-y-4 shadow-xs"
              >
                {/* Room Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-(--color-border-subtle) pb-3">
                  <div className="flex items-center gap-2.5">
                    {editingRoomId === room.id ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={editedRoomName}
                          onChange={(e) => setEditedRoomName(e.target.value)}
                          className="px-2 py-1 rounded-lg border border-(--color-accent) text-xs font-bold"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveRename(room.id)}
                          className="p-1 rounded bg-green-500/10 text-green-700"
                        >
                          <Check size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingRoomId(null)}
                          className="p-1 rounded bg-neutral-500/10 text-neutral-600"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-sm font-bold text-(--color-text) flex items-center gap-2">
                          <span>{room.name}</span>
                          <button
                            type="button"
                            onClick={() => handleStartRename(room)}
                            className="text-(--color-text-muted) hover:text-(--color-text) cursor-pointer"
                            title="Rename"
                          >
                            <Edit2 size={12} />
                          </button>
                        </h3>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-(--color-surface-secondary) border border-(--color-border) text-(--color-text-secondary)">
                          {(room.appliances || []).length} loads
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-(--color-accent)">
                      {(roomActiveWatts / 1000).toFixed(2)} kW active
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteRoom(room.id)}
                      className="p-1.5 rounded-lg text-(--color-text-muted) hover:text-red-600 hover:bg-red-500/10 transition-colors cursor-pointer"
                      title="Remove room"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Appliances List inside Room */}
                {(room.appliances || []).length === 0 ? (
                  <div className="p-4 rounded-xl border border-dashed border-(--color-border) text-center text-xs text-(--color-text-muted) space-y-2">
                    <p>No appliances assigned to this {isResidential ? 'room' : 'zone'}.</p>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setTargetRoomForApp(room.id);
                        setIsAddAppOpen(true);
                      }}
                      className="text-xs"
                    >
                      <Plus size={12} />
                      <span>Add First Appliance</span>
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {room.appliances.map((app) => (
                      <div
                        key={app.id}
                        className={`p-3 rounded-xl border transition-all space-y-2 ${
                          app.active
                            ? 'bg-(--color-surface) border-(--color-border) shadow-xs'
                            : 'bg-(--color-surface-secondary)/50 border-(--color-border-subtle) opacity-70'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="truncate">
                            <span className="text-xs font-bold text-(--color-text) block truncate">
                              {app.name}
                            </span>
                            <span className="text-[10px] font-mono text-(--color-text-muted) block">
                              {app.circuit || 'Monitored Circuit'}
                            </span>
                          </div>

                          <span
                            className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded uppercase ${
                              app.priority === 'Critical'
                                ? 'bg-red-500/10 text-red-600 border border-red-500/30'
                                : 'bg-(--color-surface-secondary) text-(--color-text-secondary) border border-(--color-border)'
                            }`}
                          >
                            {app.priority || 'Standard'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-(--color-border-subtle)">
                          <div>
                            <span className="text-xs font-mono font-bold text-(--color-text)">
                              {(app.drawKw || 0.1).toFixed(2)} kW
                            </span>
                            <span className="text-[10px] text-(--color-text-muted) block">
                              {app.active ? 'Drawing power' : 'Idle / Off'}
                            </span>
                          </div>

                          {app.controlEnabled ? (
                            <button
                              type="button"
                              onClick={() => toggleApplianceState(property.id, room.id, app.id)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all border ${
                                app.active
                                  ? 'bg-(--color-accent-subtle) border-(--color-accent) text-(--color-accent)'
                                  : 'bg-(--color-surface) border-(--color-border) text-(--color-text-muted)'
                              }`}
                            >
                              <Power size={12} />
                              <span>{app.active ? 'ON' : 'OFF'}</span>
                            </button>
                          ) : (
                            <span className="text-[10px] font-mono text-(--color-text-muted)">
                              Monitor Only
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Surface>
            );
          })}
        </div>
      )}

      {/* MODAL 1: ADD ROOM */}
      {isAddRoomOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <Surface variant="primary" padding="lg" className="w-full max-w-sm border border-(--color-border) shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-(--color-border) pb-2.5">
              <h3 className="text-sm font-bold text-(--color-text)">
                Add {isResidential ? 'New Room' : 'New Zone'}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddRoomOpen(false)}
                className="text-sm font-bold text-(--color-text-muted) cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRoom} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-(--color-text) mb-1">
                  {isResidential ? 'Room Name' : 'Zone / Department Name'}
                </label>
                <input
                  type="text"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  placeholder={isResidential ? 'e.g. Study Room, Kids Bedroom, Balcony' : 'e.g. Server Room, Canteen, Line 2'}
                  className="w-full px-3 py-2 rounded-xl border border-(--color-border) bg-(--color-surface) text-xs text-(--color-text) focus:outline-none focus:border-(--color-accent)"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-(--color-text) mb-1">
                  Room Category
                </label>
                <select
                  value={newRoomType}
                  onChange={(e) => setNewRoomType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-(--color-border) bg-(--color-surface) text-xs text-(--color-text) focus:outline-none focus:border-(--color-accent)"
                >
                  <option value="living_room">Living Room / Common Hall</option>
                  <option value="bedroom">Bedroom</option>
                  <option value="kitchen">Kitchen / Pantry</option>
                  <option value="bathroom">Bathroom / Utility</option>
                  <option value="office">Study / Home Office</option>
                  <option value="outdoor">Outdoor / Garden / Garage</option>
                  <option value="other">Other Area</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => setIsAddRoomOpen(false)} className="text-xs">
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" className="text-xs font-bold">
                  Save {isResidential ? 'Room' : 'Zone'}
                </Button>
              </div>
            </form>
          </Surface>
        </div>
      )}

      {/* MODAL 2: ADD APPLIANCE */}
      {isAddAppOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <Surface variant="primary" padding="lg" className="w-full max-w-md border border-(--color-border) shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-(--color-border) pb-2.5">
              <h3 className="text-sm font-bold text-(--color-text)">
                Add Appliance / Circuit Load
              </h3>
              <button
                type="button"
                onClick={() => setIsAddAppOpen(false)}
                className="text-sm font-bold text-(--color-text-muted) cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAppliance} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-(--color-text) mb-1">
                  Assign to {isResidential ? 'Room' : 'Zone'}
                </label>
                <select
                  value={targetRoomForApp}
                  onChange={(e) => setTargetRoomForApp(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-(--color-border) bg-(--color-surface) text-xs text-(--color-text) focus:outline-none focus:border-(--color-accent)"
                >
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-(--color-text) mb-1">
                  Appliance / Circuit Name
                </label>
                <input
                  type="text"
                  value={newAppName}
                  onChange={(e) => setNewAppName(e.target.value)}
                  placeholder="e.g. 1.5T Dual Inverter AC, Dishwasher, Water Pump"
                  className="w-full px-3 py-2 rounded-xl border border-(--color-border) bg-(--color-surface) text-xs text-(--color-text) focus:outline-none focus:border-(--color-accent)"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-(--color-text) mb-1">
                    Approx Wattage (W)
                  </label>
                  <input
                    type="number"
                    step="50"
                    min="10"
                    max="100000"
                    value={newAppWattage}
                    onChange={(e) => setNewAppWattage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-(--color-border) bg-(--color-surface) text-xs text-(--color-text) focus:outline-none focus:border-(--color-accent)"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-(--color-text) mb-1">
                    Circuit Priority
                  </label>
                  <select
                    value={newAppPriority}
                    onChange={(e) => setNewAppPriority(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-(--color-border) bg-(--color-surface) text-xs text-(--color-text) focus:outline-none focus:border-(--color-accent)"
                  >
                    <option value="Standard">Standard (Sheddable)</option>
                    <option value="High">High Priority</option>
                    <option value="Critical">Critical (Protected from Shedding)</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-(--color-text) mb-1">
                  Electrical Breaker / Socket Type
                </label>
                <input
                  type="text"
                  value={newAppCircuit}
                  onChange={(e) => setNewAppCircuit(e.target.value)}
                  placeholder="e.g. 32A DIN Contactor, 16A Dedicated Plug, MCB C16"
                  className="w-full px-3 py-2 rounded-xl border border-(--color-border) bg-(--color-surface) text-xs text-(--color-text) focus:outline-none focus:border-(--color-accent)"
                />
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-(--color-text)">
                  <input
                    type="checkbox"
                    checked={newAppControl}
                    onChange={(e) => setNewAppControl(e.target.checked)}
                    className="rounded text-(--color-accent)"
                  />
                  <span>Enable Remote Contactor / Relay Control</span>
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => setIsAddAppOpen(false)} className="text-xs">
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" className="text-xs font-bold">
                  Attach Appliance
                </Button>
              </div>
            </form>
          </Surface>
        </div>
      )}
    </div>
  );
}

export default RoomsAppliancesPage;

