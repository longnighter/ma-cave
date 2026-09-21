import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Appbar, Button, Dialog, FAB, Portal, Text } from 'react-native-paper';
import { colors } from '../../constants/theme';
import { useWines } from '../../context/WineContext';

export default function HomeScreen() {
  const router = useRouter();
  const { wines, loading, deleteWines } = useWines();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const selectionMode = selectedIds.size > 0;

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const clearSelection = () => setSelectedIds(new Set());

  const handleDelete = async () => {
    setDeleting(true);
    const ok = await deleteWines([...selectedIds]);
    setDeleting(false);
    setConfirmVisible(false);
    if (ok) clearSelection();
  };

  if (loading) {
    return (
      <View style={styles.emptyContainer}>
        <ActivityIndicator animating color={colors.gold} size="large" />
      </View>
    );
  }

  const count = selectedIds.size;

  return (
    <View style={styles.container}>
      {wines.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text variant="headlineSmall" style={styles.emptyText}>
            Votre cave est vide.
          </Text>
        </View>
      ) : (
        <FlatList
          data={wines}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContent,
            selectionMode && styles.listContentWithBar,
          ]}
          renderItem={({ item }) => {
            const selected = selectedIds.has(item.id);
            return (
              <Pressable
                style={({ pressed }) => [
                  styles.row,
                  selected && styles.rowSelected,
                  pressed && styles.rowPressed,
                ]}
                onPress={() => {
                  if (selectionMode) toggleSelect(item.id);
                  else router.push(`/${item.id}`);
                }}
                onLongPress={() => toggleSelect(item.id)}
                delayLongPress={300}
              >
                <View style={[styles.icon, selected && styles.iconSelected]}>
                  {selected ? (
                    <Text style={styles.checkMark}>✓</Text>
                  ) : null}
                </View>
                <View style={styles.rowText}>
                  <Text style={styles.rowTitle} numberOfLines={2}>
                    {item.name} ({item.year})
                  </Text>
                  <Text style={styles.rowSubtitle}>
                    {item.region || 'Région inconnue'}
                  </Text>
                </View>
              </Pressable>
            );
          }}
        />
      )}

      {selectionMode ? (
        <Appbar style={styles.actionBar}>
          <Appbar.Action icon="close" color={colors.ink} onPress={clearSelection} />
          <Appbar.Content
            title={`${count} sélectionné${count > 1 ? 's' : ''}`}
            titleStyle={styles.actionBarTitle}
          />
          <Appbar.Action
            icon="delete"
            color={colors.gold}
            onPress={() => setConfirmVisible(true)}
          />
        </Appbar>
      ) : (
        <FAB
          icon="plus"
          style={styles.fab}
          color="#ffffff"
          onPress={() => router.push('/(tabs)/add-wine')}
        />
      )}

      <Portal>
        <Dialog
          visible={confirmVisible}
          onDismiss={() => !deleting && setConfirmVisible(false)}
          style={styles.dialog}
        >
          <Dialog.Title>Supprimer {count} vin{count > 1 ? 's' : ''} ?</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogText}>
              Cette action est définitive. Les vins sélectionnés seront retirés de votre cave.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              textColor={colors.muted}
              disabled={deleting}
              onPress={() => setConfirmVisible(false)}
            >
              Annuler
            </Button>
            <Button
              textColor={colors.gold}
              loading={deleting}
              disabled={deleting}
              onPress={handleDelete}
            >
              Supprimer
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.page,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.page,
    padding: 24,
  },
  emptyText: {
    color: colors.ink,
    textAlign: 'center',
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 96,
  },
  listContentWithBar: {
    paddingBottom: 72,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.soft,
  },
  rowPressed: {
    backgroundColor: colors.pageElevated,
  },
  rowSelected: {
    backgroundColor: colors.wineSoft,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.wineSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSelected: {
    backgroundColor: colors.wine,
  },
  checkMark: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
  },
  rowSubtitle: {
    color: colors.muted,
    fontSize: 13,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: colors.wine,
  },
  actionBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.pageElevated,
    borderTopWidth: 1,
    borderTopColor: colors.soft,
  },
  actionBarTitle: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '600',
  },
  dialog: {
    backgroundColor: colors.modalBg,
  },
  dialogText: {
    color: colors.muted,
  },
});
