<template>
  <div>
    <UiPageHeader title="Configurações" subtitle="Gerencie seu perfil e preferências" />

    <v-row>
      <v-col cols="12" md="8">
        <v-card rounded="xl" :border="true">
          <v-tabs v-model="tab" color="primary" density="comfortable" class="settings-tabs">
            <v-tab value="profile">Perfil</v-tab>
            <v-tab value="security">Segurança</v-tab>
            <v-tab value="preferences">Preferências</v-tab>
          </v-tabs>
          <v-divider />

          <v-window v-model="tab">
            <!-- Profile tab -->
            <v-window-item value="profile">
              <v-card-text class="pa-6">
                <div class="avatar-section">
                  <v-avatar size="72">
                    <v-img src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin" />
                  </v-avatar>
                  <div>
                    <p class="avatar-name">Admin User</p>
                    <v-btn variant="outlined" size="small" rounded="lg" prepend-icon="mdi-camera-outline">
                      Alterar foto
                    </v-btn>
                  </div>
                </div>
                <v-divider class="my-4" />
                <v-form @submit.prevent="saveProfile">
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-text-field v-model="form.name" label="Nome completo" />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field v-model="form.email" label="E-mail" type="email" />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="form.phone"
                        v-maska="'(##) #####-####'"
                        label="Telefone"
                        prepend-inner-icon="mdi-phone-outline"
                      />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="form.cpf"
                        v-maska="'###.###.###-##'"
                        label="CPF"
                        prepend-inner-icon="mdi-card-account-details-outline"
                      />
                    </v-col>
                    <v-col cols="12">
                      <v-textarea v-model="form.bio" label="Bio" rows="3" />
                    </v-col>
                  </v-row>
                  <div class="form-actions">
                    <v-btn variant="text" @click="resetForm">Cancelar</v-btn>
                    <v-btn color="primary" rounded="lg" type="submit" :loading="saving">Salvar alterações</v-btn>
                  </div>
                </v-form>
              </v-card-text>
            </v-window-item>

            <!-- Security tab -->
            <v-window-item value="security">
              <v-card-text class="pa-6">
                <v-expansion-panels variant="accordion" class="security-panels">
                  <v-expansion-panel rounded="lg">
                    <v-expansion-panel-title>
                      <div class="panel-title">
                        <v-icon icon="mdi-lock-outline" size="18" class="mr-2" />
                        Alterar senha
                      </div>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                      <v-form class="mt-2" @submit.prevent="savePassword">
                        <v-text-field v-model="security.current" label="Senha atual" type="password" class="mb-2" />
                        <v-text-field v-model="security.new" label="Nova senha" type="password" class="mb-2" />
                        <v-text-field v-model="security.confirm" label="Confirmar senha" type="password" class="mb-3" />
                        <v-btn color="primary" rounded="lg" type="submit">Atualizar senha</v-btn>
                      </v-form>
                    </v-expansion-panel-text>
                  </v-expansion-panel>

                  <v-expansion-panel rounded="lg">
                    <v-expansion-panel-title>
                      <div class="panel-title">
                        <v-icon icon="mdi-shield-check-outline" size="18" class="mr-2" />
                        Autenticação de dois fatores
                      </div>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                      <div class="tfa-section">
                        <p class="tfa-desc">Adicione uma camada extra de segurança à sua conta.</p>
                        <v-switch v-model="tfa" label="Ativar 2FA" color="success" hide-details @change="appStore.notifySuccess('2FA ' + (tfa ? 'ativado' : 'desativado'))" />
                      </div>
                    </v-expansion-panel-text>
                  </v-expansion-panel>

                  <v-expansion-panel rounded="lg">
                    <v-expansion-panel-title>
                      <div class="panel-title">
                        <v-icon icon="mdi-devices" size="18" class="mr-2" />
                        Sessões ativas
                      </div>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                      <div v-for="session in sessions" :key="session.id" class="session-item">
                        <v-icon :icon="session.icon" size="20" />
                        <div class="session-info">
                          <span class="session-device">{{ session.device }}</span>
                          <span class="session-meta">{{ session.location }} · {{ session.time }}</span>
                        </div>
                        <v-chip v-if="session.current" size="x-small" color="success" variant="tonal">atual</v-chip>
                      </div>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-card-text>
            </v-window-item>

            <!-- Preferences tab -->
            <v-window-item value="preferences">
              <v-card-text class="pa-6">
                <div class="pref-section">
                  <p class="pref-label">Aparência</p>
                  <div class="theme-options">
                    <v-card
                      v-for="t in themeOptions"
                      :key="t.value"
                      :class="['theme-option', { 'theme-option--active': currentTheme === t.value }]"
                      rounded="lg"
                      :border="true"
                      @click="setTheme(t.value)"
                    >
                      <v-card-text class="theme-option-body">
                        <v-icon :icon="t.icon" size="22" :color="currentTheme === t.value ? 'primary' : ''" />
                        <span>{{ t.label }}</span>
                      </v-card-text>
                    </v-card>
                  </div>
                </div>

                <v-divider class="my-4" />

                <div class="pref-section">
                  <p class="pref-label">Notificações</p>
                  <v-list density="compact">
                    <v-list-item v-for="notif in notifPrefs" :key="notif.key">
                      <v-list-item-title class="notif-pref-title">{{ notif.label }}</v-list-item-title>
                      <v-list-item-subtitle>{{ notif.description }}</v-list-item-subtitle>
                      <template #append>
                        <v-switch v-model="notif.enabled" color="success" hide-details density="compact" />
                      </template>
                    </v-list-item>
                  </v-list>
                </div>
              </v-card-text>
            </v-window-item>
          </v-window>
        </v-card>
      </v-col>

      <!-- Side info -->
      <v-col cols="12" md="4">
        <v-card rounded="xl" :border="true" class="mb-4">
          <v-card-text class="pa-5">
            <p class="side-label">Conta</p>
            <div class="side-info-row"><span>Plano</span><v-chip size="x-small" color="accent" variant="tonal">Enterprise</v-chip></div>
            <div class="side-info-row"><span>Membro desde</span><span>Jan 2024</span></div>
            <div class="side-info-row"><span>Último acesso</span><span>Agora</span></div>
          </v-card-text>
        </v-card>
        <v-card rounded="xl" :border="true" class="danger-card">
          <v-card-text class="pa-5">
            <p class="side-label text-error">Zona de perigo</p>
            <p class="danger-desc">Ações irreversíveis para sua conta.</p>
            <v-btn variant="outlined" color="error" size="small" rounded="lg" block class="mt-3" @click="appStore.notifyWarning('Ação bloqueada em modo demo')">
              Excluir conta
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
  import { useTheme } from 'vuetify'

  definePageMeta({ layout: 'dashboard' })

  const appStore = useAppStore()
  const theme = useTheme()

  appStore.setPageTitle('Configurações')

  const tab = ref('profile')
  const saving = ref(false)
  const tfa = ref(false)

  const form = reactive({ name: 'Admin User', email: 'admin@pulsodash.com', phone: '', cpf: '', bio: '' })
  const security = reactive({ current: '', new: '', confirm: '' })

  const resetForm = () => Object.assign(form, { name: 'Admin User', email: 'admin@pulsodash.com', phone: '', cpf: '', bio: '' })

  const saveProfile = async () => {
    saving.value = true
    await new Promise((r) => setTimeout(r, 1200))
    saving.value = false
    appStore.notifySuccess('Perfil atualizado com sucesso')
  }

  const savePassword = () => {
    if (security.new !== security.confirm) { appStore.notifyError('As senhas não coincidem'); return }
    appStore.notifySuccess('Senha atualizada')
    Object.assign(security, { current: '', new: '', confirm: '' })
  }

  const currentTheme = computed(() => theme.global.name.value)
  const setTheme = (t: string) => { theme.global.name.value = t }

  const themeOptions = [
    { value: 'lightTheme', label: 'Claro', icon: 'mdi-white-balance-sunny' },
    { value: 'darkTheme', label: 'Escuro', icon: 'mdi-moon-waning-crescent' },
  ]

  const notifPrefs = reactive([
    { key: 'orders', label: 'Novos pedidos', description: 'Receba alertas de novos pedidos', enabled: true },
    { key: 'payments', label: 'Pagamentos', description: 'Confirmações e falhas de pagamento', enabled: true },
    { key: 'users', label: 'Novos usuários', description: 'Quando um novo usuário se cadastrar', enabled: false },
    { key: 'reports', label: 'Relatórios semanais', description: 'Resumo semanal por e-mail', enabled: true },
  ])

  const sessions = [
    { id: 1, icon: 'mdi-monitor', device: 'Windows 11 · Chrome', location: 'São Paulo, BR', time: 'Agora', current: true },
    { id: 2, icon: 'mdi-cellphone', device: 'iPhone 15 · Safari', location: 'São Paulo, BR', time: '2h atrás', current: false },
  ]
</script>

<style scoped>
.settings-tabs { padding: 0 8px; }
.avatar-section { display: flex; align-items: center; gap: 16px; margin-bottom: 16px; }
.avatar-name { font-size: 16px; font-weight: 700; margin-bottom: 6px; }
.form-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 8px; }
.security-panels :deep(.v-expansion-panel) { margin-bottom: 4px; border: 1px solid rgba(var(--v-border-color), 0.1) !important; }
.panel-title { display: flex; align-items: center; font-size: 14px; font-weight: 500; }
.tfa-section { padding: 4px 0; }
.tfa-desc { font-size: 13px; color: rgb(var(--v-theme-on-surface-variant)); margin-bottom: 12px; }
.session-item { display: flex; align-items: center; gap: 12px; padding: 8px 0; border-bottom: 1px solid rgba(var(--v-border-color), 0.08); }
.session-item:last-child { border-bottom: none; }
.session-info { display: flex; flex-direction: column; flex: 1; }
.session-device { font-size: 13px; font-weight: 500; }
.session-meta { font-size: 11px; color: rgb(var(--v-theme-on-surface-variant)); }
.pref-section { margin-bottom: 4px; }
.pref-label { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: rgb(var(--v-theme-on-surface-variant)); margin-bottom: 12px; }
.theme-options { display: flex; gap: 8px; }
.theme-option { flex: 1; cursor: pointer; transition: border-color 0.15s; }
.theme-option--active { border-color: rgb(var(--v-theme-primary)) !important; }
.theme-option-body { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 14px 8px !important; font-size: 12px; font-weight: 500; }
.notif-pref-title { font-size: 13px !important; }
.side-label { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: rgb(var(--v-theme-on-surface-variant)); margin-bottom: 12px; }
.side-info-row { display: flex; justify-content: space-between; align-items: center; padding: 6px 0; font-size: 13px; border-bottom: 1px solid rgba(var(--v-border-color), 0.06); }
.side-info-row:last-child { border-bottom: none; }
.danger-card :deep(.v-card) { border-color: rgba(var(--v-theme-error), 0.2) !important; }
.danger-desc { font-size: 12px; color: rgb(var(--v-theme-on-surface-variant)); }
</style>
