import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Download, Eye, FileText, PlayCircle } from 'lucide-react-native';
import { ThemeContext } from '../../context/ThemeContext';
import { getMaterials } from '../../services/materialService';
import { getSessions } from '../../services/sessionService';

function iconForMaterial(name = '', mimeType = '') {
  if (mimeType?.includes('video') || name.toLowerCase().endsWith('.mp4')) {
    return PlayCircle;
  }

  return FileText;
}

export default function MaterialsScreen({ route }) {
  const { colors } = useContext(ThemeContext);
  const postId = route.params?.postId;
  const sessionId = route.params?.sessionId;
  const [postMaterials, setPostMaterials] = useState([]);
  const [sessionMaterials, setSessionMaterials] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const loadMaterials = async () => {
      const [allPostMaterials, sessions] = await Promise.all([
        getMaterials(),
        getSessions(),
      ]);

      setPostMaterials(allPostMaterials);

      if (sessionId) {
        const session = sessions.find((item) => item.id === sessionId);
        setSessionMaterials(session?.materials ?? []);
        setSubmissions(session?.assignments?.flatMap((item) => item.submissions ?? []) ?? []);
      }
    };

    loadMaterials();
  }, [sessionId]);

  const filteredPostMaterials = useMemo(
    () => (postId ? postMaterials.filter((item) => item.postId === postId) : postMaterials),
    [postId, postMaterials]
  );

  const combinedMaterials = sessionId ? sessionMaterials : filteredPostMaterials;

  const openFile = async (uri) => {
    if (uri) {
      await Linking.openURL(uri);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.title, { color: colors.text }]}>
        {sessionId ? 'Session Materials' : postId ? 'Post Materials' : 'Learning Materials'}
      </Text>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>
        Open files online, view videos, or download shared learning resources.
      </Text>

      <FlatList
        data={combinedMaterials}
        scrollEnabled={false}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>
            No materials uploaded yet.
          </Text>
        }
        renderItem={({ item }) => {
          const MaterialIcon = iconForMaterial(item.name, item.mimeType);

          return (
            <View
              style={[
                styles.card,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  shadowColor: colors.shadow,
                },
              ]}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.iconWrap, { backgroundColor: colors.primarySoft }]}>
                  <MaterialIcon size={18} color={colors.primary} />
                </View>
                <View style={styles.cardText}>
                  <Text style={[styles.cardTitle, { color: colors.text }]}>{item.name}</Text>
                  <Text style={[styles.cardMeta, { color: colors.textMuted }]}>
                    {item.mimeType || 'Shared resource'}
                  </Text>
                </View>
              </View>

              <View style={styles.row}>
                <Pressable
                  style={[styles.action, { backgroundColor: colors.cardSecondary }]}
                  onPress={() => openFile(item.uri)}
                >
                  <Eye color={colors.text} size={16} />
                  <Text style={[styles.actionText, { color: colors.text }]}>View</Text>
                </Pressable>
                <Pressable
                  style={[styles.action, { backgroundColor: colors.cardSecondary }]}
                  onPress={() => openFile(item.uri)}
                >
                  <Download color={colors.text} size={16} />
                  <Text style={[styles.actionText, { color: colors.text }]}>Download</Text>
                </Pressable>
              </View>
            </View>
          );
        }}
      />

      {sessionId ? (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Assignment Submissions
          </Text>
          {submissions.length ? (
            submissions.map((item) => (
              <Pressable
                key={item.id}
                style={[
                  styles.submissionCard,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
                onPress={() => openFile(item.uri)}
              >
                <Text style={[styles.cardTitle, { color: colors.text }]}>{item.name}</Text>
                <Text style={[styles.cardMeta, { color: colors.textMuted }]}>
                  Tap to open online or download.
                </Text>
              </Pressable>
            ))
          ) : (
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>
              No assignment submissions yet.
            </Text>
          )}
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 18,
    paddingBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 18,
  },
  card: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  cardMeta: {
    fontSize: 13,
    lineHeight: 18,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '700',
  },
  section: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 12,
  },
  submissionCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: 26,
  },
});
