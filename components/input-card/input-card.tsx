{/* Phone Number */}
              {selectedPlan && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <Card className="glass-card">
                    <CardContent className="p-6">
                      <div className="floating-label">
                        <Input
                          type="tel"
                          placeholder=" "
                          {...register("phoneNumber")}
                          className={`h-14 bg-white/5 border-white/20 text-foreground placeholder-transparent ${
                            errors.phoneNumber ? "border-red-500" : ""
                          }`}
                        />
                        <label className="floating-label-text">Phone Number</label>
                        {errors.phoneNumber && (
                          <p className="text-sm text-red-500 mt-1">{errors.phoneNumber.message}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
