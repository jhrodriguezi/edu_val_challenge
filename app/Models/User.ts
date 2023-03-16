import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import DocumentType from './DocumentType'
import Role from './Role'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public first_name: string

  @column()
  public second_name: string

  @column()
  public surname: string

  @column()
  public second_surname: string

  @column()
  public document_type_id: number

  @column()
  public document_number: string

  @column()
  public email: string

  @column()
  public password: string

  @column()
  public role_id: number

  @column()
  public phone: string

  @column()
  public state: boolean

  @column()
  public rememberMeToken: string | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasOne(() => Role)
  public role: HasOne<typeof Role>

  @hasOne(() => DocumentType)
  public documentType: HasOne<typeof DocumentType>

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
